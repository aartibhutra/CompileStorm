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
        // NEW: track load per worker
        this.workerLoad = new Map();
        this.workerFile = path_1.default.join(__dirname, "worker.js");
        for (let i = 0; i < size; i++) {
            const worker = this.createWorker();
            this.workers.push(worker);
            this.workerLoad.set(worker, 0); // initialize load
        }
    }
    createWorker() {
        return new worker_threads_1.Worker(this.workerFile);
    }
    getLeastLoadedWorker() {
        let least = null;
        for (const worker of this.workers) {
            if (this.busy.has(worker))
                continue;
            if (!least) {
                least = worker;
                continue;
            }
            if (this.workerLoad.get(worker) < this.workerLoad.get(least)) {
                least = worker;
            }
        }
        return least;
    }
    runJob(job) {
        return new Promise((resolve) => {
            this.queue.push({ job, resolve });
            this.dispatch();
        });
    }
    dispatch() {
        while (this.queue.length > 0) {
            // pick the least loaded free worker
            const worker = this.getLeastLoadedWorker();
            if (!worker)
                return; // all busy → stop
            const { job, resolve } = this.queue.shift();
            this.busy.add(worker);
            // increment load
            this.workerLoad.set(worker, this.workerLoad.get(worker) + 1);
            worker.once("message", (result) => {
                this.busy.delete(worker);
                // decrement load
                this.workerLoad.set(worker, this.workerLoad.get(worker) - 1);
                resolve(result);
                this.dispatch(); // try dispatching remaining jobs
            });
            worker.postMessage(job);
        }
    }
}
exports.WorkerPool = WorkerPool;
