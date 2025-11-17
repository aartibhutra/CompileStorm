const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  // "https://compilestorm-frontend.netlify.app",
  "https://compilestorm.devsapp.tech"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman, curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

require('dotenv').config();

const compileRoutes = require("./routes/compile");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", compileRoutes);
app.use("/api", require("./routes/project"));

// MongoDB connection
mongoose.connect(process.env.DATABASE_URI)
.then(() => {
  console.log("Connected to MongoDB");
  // Start server after DB connection
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("MongoDB connection error:", error);
});
