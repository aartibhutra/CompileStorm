"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const server_1 = require("../server");
const router = (0, express_1.Router)();
router.post("/run", async (req, res) => {
    try {
        const { language, entryFile, input, files } = req.body;
        if (!language || !entryFile || !files) {
            return res.status(400).json({
                error: "language, entryFile, and files are required",
            });
        }
        // Send job to worker pool (baseline no scheduling)
        const result = await server_1.workerPool.runJob({
            language,
            entryFile,
            input: input || "",
            files,
        });
        return res.json(result);
    }
    catch (err) {
        return res.status(500).json({
            error: "Error executing job",
            details: err.toString(),
        });
    }
});
exports.default = router;
