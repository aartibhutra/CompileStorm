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

  constructor(private size: number) {
    this.workerFile = path.join(__dirname, "worker.js");

    for (let i = 0; i < size; i++) {
      this.workers.push(this.createWorker());
    }
  }

  private createWorker(): Worker {
    const worker = new Worker(this.workerFile);
    return worker;
  }

  runJob(job: Job): Promise<any> {
    return new Promise((resolve) => {
      this.queue.push({ job, resolve });
      this.dispatch();
    });
  }

  private dispatch() {
    for (const worker of this.workers) {
      if (this.busy.has(worker)) continue;
      if (this.queue.length === 0) continue;

      const { job, resolve } = this.queue.shift()!;

      this.busy.add(worker);

      worker.once("message", (result) => {
        this.busy.delete(worker);
        resolve(result);
        this.dispatch();
      });

      worker.postMessage(job);
    }
  }
}
