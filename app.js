const express = require("express");
require("dotenv").config();

// Test Connection Import
const { testConnection } = require("./config/db");

const app = express();
app.use(express.json());

//Routes
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require('./routes/enrollment');
const errorHandler = require("./middleware/errorHandler");
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use(errorHandler);

const start = async () => {
  await testConnection();

  app.listen(3000, () => {
    console.log("Server LMS app sudah jalan");
  });
};

start();
