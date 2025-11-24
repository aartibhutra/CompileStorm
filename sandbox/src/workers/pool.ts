import { Worker } from "worker_threads";
import path from "path";

interface Job {
  language: string;
  entryFile: string;
  input: string;
  files: Record<string, string>;
}

interface QueueItem {
  job: Job;
  resolve: (value: any) => void;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private queue: QueueItem[] = [];
  private busy: Set<Worker> = new Set();
  private workerFile: string;

  // NEW: track load per worker
  private workerLoad = new Map<Worker, number>();

  constructor(private size: number) {
    this.workerFile = path.join(__dirname, "worker.js");

    for (let i = 0; i < size; i++) {
      const worker = this.createWorker();
      this.workers.push(worker);
      this.workerLoad.set(worker, 0);   // initialize load
    }
  }

  private createWorker(): Worker {
    return new Worker(this.workerFile);
  }

  private getLeastLoadedWorker(): Worker | null {
    let least: Worker | null = null;

    for (const worker of this.workers) {
      if (this.busy.has(worker)) continue;

      if (!least) {
        least = worker;
        continue;
      }

      if (this.workerLoad.get(worker)! < this.workerLoad.get(least)!) {
        least = worker;
      }
    }

    return least;
  }

  runJob(job: Job): Promise<any> {
    return new Promise((resolve) => {
      this.queue.push({ job, resolve });
      this.dispatch();
    });
  }

  private dispatch() {
    while (this.queue.length > 0) {
      // pick the least loaded free worker
      const worker = this.getLeastLoadedWorker();
      if (!worker) return; // all busy → stop

      const { job, resolve } = this.queue.shift()!;
      this.busy.add(worker);

      // increment load
      this.workerLoad.set(worker, this.workerLoad.get(worker)! + 1);

      worker.once("message", (result) => {
        this.busy.delete(worker);

        // decrement load
        this.workerLoad.set(worker, this.workerLoad.get(worker)! - 1);

        resolve(result);
        this.dispatch(); // try dispatching remaining jobs
      });

      worker.postMessage(job);
    }
  }
}
