const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifytoken");
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject
} = require("../controllers/project");

router.post("/project", verifyToken, createProject);
router.get("/projects", verifyToken, getProjects);
router.get("/project/:id", verifyToken, getProject);
router.put("/project/:id", verifyToken, updateProject);
router.delete("/project/:id", verifyToken, deleteProject);

module.exports = router;
