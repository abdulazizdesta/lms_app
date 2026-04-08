const express = require("express");
require("dotenv").config();
const { testConnection } = require("./config/db");
const AppError = require("./utils/AppError");

const app = express();
app.use(express.json());

//Routes
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const userRoutes = require("./routes/user");
const courseRoutes = require("./routes/course");
const enrollmentRoutes = require('./routes/enrollment');
const errorHandler = require("./middleware/errorHandler");
app.use("/auth", authRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);
app.use('/enrollments', enrollmentRoutes);


app.use((req, _res, next) => {
  next(new AppError(`${req.method} ${req.url} not found`, 404))
})

app.use(errorHandler);

const start = async () => {
  await testConnection();

  app.listen(3000, () => {
    console.log("Server LMS app sudah jalan");
  });
};

start();
