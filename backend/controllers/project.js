const Project = require("../models/project");

exports.createProject = async (req, res) => {
  try {
    const { name, language, structure } = req.body;

    const project = await Project.create({
      userId: req.user.userId,
      name,
      language,
      structure
    });

    res.status(201).json({ project });
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: "Error fetching projects" });
  }
};

exports.getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: "Error fetching project" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { structure, name, language } = req.body;

    const updateData = {};
    if (structure) updateData.structure = structure;
    if (name) updateData.name = name;
    if (language) updateData.language = language;

    const updated = await Project.findOneAndUpdate(
      { _id: id, userId: req.user.userId },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project updated", project: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.deleteProject = async (req, res) => {
  try {
    await Project.deleteOne({
      _id: req.params.id,
      userId: req.user.userId
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
};
