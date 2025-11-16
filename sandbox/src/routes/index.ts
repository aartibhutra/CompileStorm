import { Router } from "express";
import { nanoid } from "nanoid";
import { spawn } from "child_process"; // lets you run another program as a separate process (runs a command outside node and gives the live output)
import fs from "fs"; // stands for file system (any operations related to files)
import path from "path"; // helps to build and work with file paths safely cross platform

const router = Router();

function convertToDockerPath(winPath: string) {
  let p = winPath.replace(/\\/g, "/");
  p = p.replace(/^C:/i, "/c");
  return p;
}

router.post("/run", async (req, res) => {
  const { language, code, input } = req.body;

  if (!language || !code) {
    return res.status(400).json({ error: "language and code are required" });
  }

  const jobId = nanoid();
  const jobDir = path.join(process.cwd(), "sandbox", jobId);
  fs.mkdirSync(jobDir, { recursive: true });

  let filename = "";
  let compileCmd = "";
  let runCmd = "";

  switch (language) {
    case "python":
      filename = "main.py";
      fs.writeFileSync(path.join(jobDir, filename), code);
      runCmd = "python3 main.py";
      break;
    case "java":
      filename = "Main.java";
      fs.writeFileSync(path.join(jobDir, filename), code);
      compileCmd = "javac Main.java";
      runCmd = "java Main";
      break;
    case "c":
      filename = "main.c";
      fs.writeFileSync(path.join(jobDir, filename), code);
      compileCmd = "gcc main.c -o main";
      runCmd = "./main";
      break;
    case "cpp":
      filename = "main.cpp";
      fs.writeFileSync(path.join(jobDir, filename), code);
      compileCmd = "g++ main.cpp -o main";
      runCmd = "./main";
      break;
    case "js":
      filename = "main.js";
      fs.writeFileSync(path.join(jobDir, filename), code);
      runCmd = "node main.js";
      break;
  }

  const mountPath = convertToDockerPath(jobDir);

  const args = [
    "run",
    "--rm",
    "-i", //interactive mode to give inputs
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

  if (input) {
    child.stdin.write(input + "\n");
  }
  child.stdin.end();

  child.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  child.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  child.on("close", () => {
    fs.rm(jobDir, { recursive: true, force: true }, () => {});
    res.json({ stdout, stderr });
  });
});

export default router;
