const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const compileRoutes = require("./routes/compile");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
// Routes
app.use("/api", compileRoutes);
// MongoDB connection
mongoose.connect("mongodb://localhost:27017/compilestorm", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
  // Start server after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});
