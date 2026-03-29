const { pool } = require("../config/db");

const CourseModel = {
  findAll: async () => {
    const [result] = await pool.query("SELECT * FROM courses");
    return result;
  },

  findById: async (id) => {
    const [result] = await pool.query("SELECT * FROM courses WHERE id = ?", [
      id,
    ]);
    return result[0];
  },

  store: async (data) => {
    const [result] = await pool.query("INSERT INTO courses SET ?", [data]);
    return result;
  },

  update: async (id, data) => {
    const [result] = await pool.query("UPDATE courses SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM courses WHERE id = ?", [
      id,
    ]);
    return result;
  },

  getStudentsCount: async () => {
    const [result] = await pool.query(
      "SELECT courses.id, courses.title, COUNT(enrollments.id) AS total_students FROM courses LEFT JOIN enrollments ON enrollments.course_id = courses.id GROUP BY courses.id, courses.title",
    );
    return result
  },

   showCategoryName: async () => {
    const [result] = await pool.query(
        "SELECT courses.id, courses.title, courses.category_id, categories.name AS category_name  FROM courses JOIN categories on categories.id = courses.category_id"
    );
    return result
  }
};

module.exports = CourseModel;
