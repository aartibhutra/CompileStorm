"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const nanoid_1 = require("nanoid");
const child_process_1 = require("child_process");
function convertToDockerPath(winPath) {
    let p = winPath.replace(/\\/g, "/");
    p = p.replace(/^C:/i, "/c");
    return p;
}
function extractJavaPackage(javaCode) {
    const match = javaCode.match(/^\s*package\s+([\w\.]+)\s*;/m);
    return match ? match[1] : "";
}
worker_threads_1.parentPort.on("message", async (job) => {
    const { language, entryFile, input, files } = job;
    const jobId = (0, nanoid_1.nanoid)();
    const jobDir = path_1.default.join(process.cwd(), "sandbox", jobId);
    fs_1.default.mkdirSync(jobDir, { recursive: true });
    for (const filePath of Object.keys(files)) {
        const fullPath = path_1.default.join(jobDir, filePath);
        fs_1.default.mkdirSync(path_1.default.dirname(fullPath), { recursive: true });
        fs_1.default.writeFileSync(fullPath, files[filePath]);
    }
    let compileCmd = "";
    let runCmd = "";
    switch (language) {
        case "python":
            runCmd = `python3 ${entryFile}`;
            break;
        case "js":
            runCmd = `node ${entryFile}`;
            break;
        case "java": {
            compileCmd = `javac -d . $(find . -name "*.java")`;
            const entryContent = files[entryFile];
            const pkg = extractJavaPackage(entryContent);
            const simple = path_1.default.basename(entryFile, ".java");
            const mainClass = pkg ? `${pkg}.${simple}` : simple;
            runCmd = `java -cp . ${mainClass}`;
            break;
        }
        case "c":
            compileCmd = `gcc $(find . -name "*.c") -o main`;
            runCmd = `./main`;
            break;
        case "cpp":
            compileCmd = `g++ $(find . -name "*.cpp") -o main`;
            runCmd = `./main`;
            break;
        default:
            worker_threads_1.parentPort.postMessage({
                stdout: "",
                stderr: "Unsupported language",
            });
            return;
    }
    const mountPath = convertToDockerPath(jobDir);
    const args = [
        "run",
        "--rm",
        "-i",
        "-v",
        `${mountPath}:/sandbox`,
        "compile-sandbox",
        "bash",
        "-c",
        `cd /sandbox && ${compileCmd ? compileCmd + " && " : ""}${runCmd}`,
    ];
    let stdout = "";
    let stderr = "";
    const child = (0, child_process_1.spawn)("docker", args);
    if (input)
        child.stdin.write(input + "\n");
    child.stdin.end();
    child.stdout.on("data", (data) => (stdout += data.toString()));
    child.stderr.on("data", (data) => (stderr += data.toString()));
    child.on("close", () => {
        fs_1.default.rm(jobDir, { recursive: true, force: true }, () => { });
        worker_threads_1.parentPort.postMessage({ stdout, stderr });
    });
});
