
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const profileRoutes = require("./routes/profileRoutes");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes");
const serviceRequestRoutes = require("./routes/serviceRequestRoutes");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/profile", profileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/service-requests", serviceRequestRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to FORGE API",
    status: "running"
  });
});

module.exports = app;
