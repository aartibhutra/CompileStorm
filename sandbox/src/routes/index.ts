import { Router } from "express";
import { nanoid } from "nanoid";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const router = Router();

function convertToDockerPath(winPath: string) {
  let p = winPath.replace(/\\/g, "/");
  p = p.replace(/^C:/i, "/c");
  return p;
}

function extractJavaPackage(javaCode: any) {
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
  const jobId = nanoid();
  const jobDir = path.join(process.cwd(), "sandbox", jobId); // sandbox is the folder they will be stored temporirily
  fs.mkdirSync(jobDir, { recursive: true }); // if dir exist fine if not then create it

  for (const relativePath of Object.keys(files)) {
    const fullPath = path.join(jobDir, relativePath);
    const dir = path.dirname(fullPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fullPath, files[relativePath]);
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

    // case "java":
    //   compileCmd = `javac $(find . -name "*.java")`; // searches every direc to get the name consisting .java
    //   const mainClass = path.basename(entryFile, ".java"); // returns the file name from the path and strips .java from it so for Main.java it is Main
    //   runCmd = `java ${mainClass}`;
    //   break;

    case "java":
      compileCmd = `javac $(find . -name "*.java")`;

      // Extract package from the actual file content
      const entryContent = files[entryFile];
      const pkg = extractJavaPackage(entryContent);   // "" or "app" or "mypkg.util"

      const simpleName = path.basename(entryFile, ".java");  // Main

      const mainClassName = pkg ? `${pkg}.${simpleName}` : simpleName;

      runCmd = `java -cp . ${mainClassName}`;
      break;

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

  const child = spawn("docker", args); // start docker process 

  // Pass runtime input (stdin)
  if (input) child.stdin.write(input + "\n");
  child.stdin.end();

  child.stdout.on("data", (data) => (stdout += data.toString()));
  child.stderr.on("data", (data) => (stderr += data.toString()));

  child.on("close", () => {
    fs.rm(jobDir, { recursive: true, force: true }, () => {});
    res.json({ stdout, stderr });
  });
});

export default router;