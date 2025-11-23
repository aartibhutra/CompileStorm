"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nanoid_1 = require("nanoid");
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
function convertToDockerPath(winPath) {
    let p = winPath.replace(/\\/g, "/");
    p = p.replace(/^C:/i, "/c");
    return p;
}
function extractJavaPackage(javaCode) {
    const match = javaCode.match(/^\s*package\s+([\w\.]+)\s*;/m);
    return match ? match[1] : ""; // "" means default package
}
router.post("/run", async (req, res) => {
    const { language, entryFile, input, files } = req.body;
    if (!language || !files || !entryFile) {
        return res.status(400).json({
            error: "language, entryFile, and files are required",
        });
    }
    // Create project directory
    const jobId = (0, nanoid_1.nanoid)();
    const jobDir = path_1.default.join(process.cwd(), "sandbox", jobId); // sandbox is the folder they will be stored temporirily
    fs_1.default.mkdirSync(jobDir, { recursive: true }); // if dir exist fine if not then create it
    for (const relativePath of Object.keys(files)) {
        const fullPath = path_1.default.join(jobDir, relativePath);
        const dir = path_1.default.dirname(fullPath);
        fs_1.default.mkdirSync(dir, { recursive: true });
        fs_1.default.writeFileSync(fullPath, files[relativePath]);
    } // creating whole folder structure and writing the files content
    // Build compile command + run command
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
            const simpleName = path_1.default.basename(entryFile, ".java");
            const mainClassName = pkg ? `${pkg}.${simpleName}` : simpleName;
            runCmd = `java -cp . ${mainClassName}`;
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
            return res.status(400).json({ error: "Unsupported language" });
    }
    const mountPath = convertToDockerPath(jobDir);
    // Build Docker command
    const args = [
        "run",
        "--rm", // remove the docker when the process is finished
        "-i", // make it interactive to take input also or to get access to cli
        "-v", // mount this volume to the /sandbox in the docker container
        `${mountPath}:/sandbox`,
        "compile-sandbox", // name of the docker image
        "bash",
        "-c",
        `cd /sandbox && ${compileCmd ? compileCmd + " && " : ""}${runCmd}`,
    ];
    let stdout = "";
    let stderr = "";
    const child = (0, child_process_1.spawn)("docker", args); // start docker process 
    // Pass runtime input (stdin)
    if (input)
        child.stdin.write(input + "\n");
    child.stdin.end();
    child.stdout.on("data", (data) => (stdout += data.toString()));
    child.stderr.on("data", (data) => (stderr += data.toString()));
    child.on("close", () => {
        fs_1.default.rm(jobDir, { recursive: true, force: true }, () => { });
        res.json({ stdout, stderr });
    });
});
exports.default = router;
