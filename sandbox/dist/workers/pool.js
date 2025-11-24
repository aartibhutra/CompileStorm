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
        this.workerFile = path_1.default.join(__dirname, "worker.js");
        for (let i = 0; i < size; i++) {
            this.workers.push(new worker_threads_1.Worker(this.workerFile));
        }
    }
    getJobSize(job) {
        let size = 0;
        for (const content of Object.values(job.files)) {
            size += content.length;
        }
        return size;
    }
    runJob(job) {
        return new Promise((resolve) => {
            const size = this.getJobSize(job);
            this.queue.push({ job, resolve, size });
            // SJF => smallest size first
            this.queue.sort((a, b) => a.size - b.size);
            this.dispatch();
        });
    }
    dispatch() {
        for (const worker of this.workers) {
            if (this.busy.has(worker))
                continue;
            if (this.queue.length === 0)
                continue;
            const { job, resolve } = this.queue.shift();
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
exports.WorkerPool = WorkerPool;
