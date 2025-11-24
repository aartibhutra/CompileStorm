import { parentPort } from "worker_threads";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { spawn } from "child_process";

function convertToDockerPath(winPath: string) {
  let p = winPath.replace(/\\/g, "/");
  p = p.replace(/^C:/i, "/c");
  return p;
}

function extractJavaPackage(javaCode: string) {
  const match = javaCode.match(/^\s*package\s+([\w\.]+)\s*;/m);
  return match ? match[1] : "";
}

parentPort!.on("message", async (job: any) => {
  const { language, entryFile, input, files } = job;

  const jobId = nanoid();
  const jobDir = path.join(process.cwd(), "sandbox", jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  for (const filePath of Object.keys(files)) {
    const fullPath = path.join(jobDir, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, files[filePath]);
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
      const simple = path.basename(entryFile, ".java");
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
      parentPort!.postMessage({
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

  const child = spawn("docker", args);

  if (input) child.stdin.write(input + "\n");
  child.stdin.end();

  child.stdout.on("data", (data) => (stdout += data.toString()));
  child.stderr.on("data", (data) => (stderr += data.toString()));

  child.on("close", () => {
    fs.rm(jobDir, { recursive: true, force: true }, () => {});
    parentPort!.postMessage({ stdout, stderr });
  });
});
