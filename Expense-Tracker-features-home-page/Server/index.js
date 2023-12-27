// index.js

const express = require("express");
const app = express();
const port = 5000;

// Load environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

// Import routes
const authRoutes = require("./Routes/authRoutes");

// Use routes
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
