const { pool } = require("../config/db");

const UserModel = {
  findAll: async () => {
    const [result] = await pool.query("SELECT name, email, role FROM users");
    return result;
  },

  findById: async (id) => {
    const [result] = await pool.query("SELECT name, email, role FROM users WHERE id = ?", [id]);
    return result[0];
  },

  findByEmail: async (email) => {
    const [result] = await pool.query("SELECT name, email, role FROM users WHERE email = ?", [
      email,
    ]);
    return result[0];
  },

  registration: async (data) => {
    const [result] = await pool.query("INSERT INTO users SET ?", [data]);
    return result;
  },

  login: async (data) => {
    const [result] = await pool.query(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [data.email, data.password],
    );
    return result;
  },

  store: async (data) => {
    const [result] = await pool.query("INSERT INTO users SET ?", [data]);
    return result;
  },

  update: async (id, data) => {
    const [result] = await pool.query("UPDATE users SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result;
  },

  getEnrollmentsCount: async () => {
    const [result] = await pool.query(
      "SELECT users.id, users.name, users.role, COUNT(enrollments.id) AS total_enrollments FROM users LEFT JOIN enrollments ON enrollments.user_id= users.id WHERE users.role = 'student' GROUP BY users.id, users.name, users.role",
    );
    return result;
  },

  getInstructorCourseCount: async () => {
    const [result] = await pool.query(
      "SELECT users.id, users.name AS instructor_name, COUNT(courses.id) AS total_courses FROM users JOIN courses ON courses.instructor_id = users.id WHERE users.role = 'instructor' GROUP BY users.id, users.name",
    );
    return result;
  },
};

module.exports = UserModel;
