const express = require("express");
require("dotenv").config();

// Test Connection Import
const app = express();
const { testConnection } = require("./config/db");
app.use(express.json());

//Routes
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require('./routes/enrollment');
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use('/enrollments', enrollmentRoutes);

const start = async () => {
  await testConnection();

  app.listen(3000, () => {
    console.log("Server LMS app sudah jalan");
  });
};

start();
