const { pool } = require("../config/db");

const CategoryModel = {
  findAll: async () => {
    const [result] = await pool.query("SELECT * FROM categories");
    return result;
  },

  findById: async (id) => {
    const [result] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return result[0];
  },

  store: async (data) => {
    const [result] = await pool.query("INSERT INTO categories SET ?", [data]);
    return result;
  },

  update: async (id, data) => {
    const [result] = await pool.query("UPDATE categories SET ? WHERE id = ?", [
      data,
      id,
    ]);
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    return result;
  },

  getCoursesCount: async () => {
    const [result] = await pool.query(
      "SELECT categories.id, categories.name, COUNT(courses.id) AS total_courses FROM categories LEFT JOIN courses ON courses.category_id= categories.id GROUP BY categories.id, categories.name",
    );
    return result
  }
};

module.exports = CategoryModel;
