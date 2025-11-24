"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerPool = void 0;
const worker_threads_1 = require("worker_threads");
const path_1 = __importDefault(require("path"));
class WorkerPool {
    constructor(size) {
        this.size = size;
        this.workers = [];
        this.queue = [];
        this.busy = new Set();
        this.rrIndex = 0; // round-robin pointer
        this.workerFile = path_1.default.join(__dirname, "worker.js");
        for (let i = 0; i < size; i++) {
            this.workers.push(this.createWorker());
        }
    }
    createWorker() {
        return new worker_threads_1.Worker(this.workerFile);
    }
    runJob(job) {
        return new Promise((resolve) => {
            this.queue.push({ job, resolve });
            this.dispatch();
        });
    }
    dispatch() {
        while (this.queue.length > 0) {
            // Try assigning job to a worker using RR
            let attempts = 0;
            let assigned = false;
            while (attempts < this.workers.length && !assigned) {
                const worker = this.workers[this.rrIndex];
                // Move pointer for next assignment ahead
                this.rrIndex = (this.rrIndex + 1) % this.workers.length;
                attempts++;
                if (this.busy.has(worker))
                    continue;
                // Free worker found → assign job
                const { job, resolve } = this.queue.shift();
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
            if (!assigned)
                break;
        }
    }
}
exports.WorkerPool = WorkerPool;
