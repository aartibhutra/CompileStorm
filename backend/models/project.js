const mongoose = require(
  "mongoose"
)

const fileSchema = new mongoose.Schema({
  name: String,
  type: String,
  content: String,
  children: [this] 
});

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  language: { type: String, required: true },
  structure: [Object],   // folder/file tree
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", projectSchema);