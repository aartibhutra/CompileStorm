const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
app.use(
    cors({ // allow users to hit backend with the given origins
      // origin: "http://localhost:5173", // Frontend URL
        origin : "https://compilestorm-frontend.netlify.app",
      credentials: true, // Allow cookies
    })
);

// const allowedOrigins = ['http://localhost:5173', 'https://compilestorm-frontend.netlify.app'];

// app.use(cors({
//   origin: (origin, callback) => {
//     // Check if the origin is allowed, or if it's not provided (e.g., for non-browser clients like Postman)
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true // Allow credentials (cookies, authentication headers, etc.)
// }));

require('dotenv').config();

const compileRoutes = require("./routes/compile");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", compileRoutes);

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
