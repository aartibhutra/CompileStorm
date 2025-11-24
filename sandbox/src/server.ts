import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import CodeRoutes from "./routes/index";

import { WorkerPool } from "./workers/pool";
export const workerPool = new WorkerPool(4); // baseline: 4 workers

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/api/v1", CodeRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT}`);
});