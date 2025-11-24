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

  private rrIndex = 0; // round-robin pointer

  constructor(private size: number) {
    this.workerFile = path.join(__dirname, "worker.js");

    for (let i = 0; i < size; i++) {
      this.workers.push(this.createWorker());
    }
  }

  private createWorker(): Worker {
    return new Worker(this.workerFile);
  }

  runJob(job: Job): Promise<any> {
    return new Promise((resolve) => {
      this.queue.push({ job, resolve });
      this.dispatch();
    });
  }

  private dispatch() {
    while (this.queue.length > 0) {
      // Try assigning job to a worker using RR
      let attempts = 0;
      let assigned = false;

      while (attempts < this.workers.length && !assigned) {
        const worker = this.workers[this.rrIndex];

        // Move pointer for next assignment ahead
        this.rrIndex = (this.rrIndex + 1) % this.workers.length;

        attempts++;

        if (this.busy.has(worker)) continue;

        // Free worker found → assign job
        const { job, resolve } = this.queue.shift()!;
        this.busy.add(worker);

        worker.once("message", (result) => {
          this.busy.delete(worker);
          resolve(result);
          this.dispatch(); // continue dispatching after job finishes
        });

        worker.postMessage(job);
        assigned = true;
      }

      // If no worker was free → stop
      if (!assigned) break;
    }
  }
}
