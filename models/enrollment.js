const { pool } = require("../config/db");

const EnrollmentModel = {
  findAll: async () => {
    const [result] = await pool.query("SELECT * FROM enrollments");
    return result;
  },

  findById: async (id) => {
    const [result] = await pool.query("SELECT * FROM enrollments WHERE id = ?", [id]);
    return result[0];
  },

  store: async (data) => {
    const [result] = await pool.query("INSERT INTO enrollments SET ?", [data]);
    return result;
  },

  update: async (id, data) => {
    const [result] = await pool.query("UPDATE enrollments SET ? WHERE id = ?", [data, id]);
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM enrollments WHERE id = ?", [id]);
    return result;
  },

  getDetail: async () => {
    const [result] = await pool.query(`
      SELECT 
        enrollments.id,
        users.name AS student_name,
        courses.title AS course_title,
        enrollments.enrolled_at
      FROM enrollments
      LEFT JOIN users ON users.id = enrollments.user_id
      LEFT JOIN courses ON courses.id = enrollments.course_id
    `);
    return result;
  }
};

module.exports = EnrollmentModel;