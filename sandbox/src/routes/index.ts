import { Router } from "express";
import { workerPool } from "../server";

const router = Router();

router.post("/run", async (req, res) => {
  try {
    const { language, entryFile, input, files } = req.body;

    if (!language || !entryFile || !files) {
      return res.status(400).json({
        error: "language, entryFile, and files are required",
      });
    }

    // Send job to worker pool (baseline no scheduling)
    const result = await workerPool.runJob({
      language,
      entryFile,
      input: input || "",
      files,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      error: "Error executing job",
      details: err.toString(),
    });
  }
});

export default router;
