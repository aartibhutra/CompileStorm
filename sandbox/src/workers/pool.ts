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
  size: number; // natural job size (bytes)
}

export class WorkerPool {
  private workers: Worker[] = [];
  private queue: QueueItem[] = [];
  private busy: Set<Worker> = new Set();
  private workerFile: string;

  constructor(private size: number) {
    this.workerFile = path.join(__dirname, "worker.js");

    for (let i = 0; i < size; i++) {
      this.workers.push(new Worker(this.workerFile));
    }
  }

  private getJobSize(job: Job): number {
    let size = 0;
    for (const content of Object.values(job.files)) {
      size += content.length;
    }
    return size;
  }

  runJob(job: Job): Promise<any> {
    return new Promise((resolve) => {

      const size = this.getJobSize(job);

      this.queue.push({ job, resolve, size });

      // SJF => smallest size first
      this.queue.sort((a, b) => a.size - b.size);

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
