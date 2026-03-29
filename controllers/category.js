const CategoryModel = require("../models/category");

const CategoryController = {
  getAll: async (req, res) => {
    try {
      const categories = await CategoryModel.findAll();
      res.json({
        code: 200,
        message: "Sukses tampilkan semua data",
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const categories = await CategoryModel.findById(id);
      if (!categories)
        return res
          .status(404)
          .json({ message: `Data dengan id ${id} tidak ditemukan` });
      res.json({
        code: 200,
        message: `Sukses tampilkan data dengan id ${id}`,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  store: async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: "Dibutuhkan Nama Kategori" });
      }

      const data = {
        name: name,
      };

      const categories = await CategoryModel.store(data);
      res.status(201).json({
        message: "Sukses menambahkan data",
        data: {
          id: categories.insertId,
          name: data.name,
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const oldCategory = await CategoryModel.findById(id);

      if (!oldCategory)
        return res
          .status(404)
          .json({ message: `Tidak ada Kategori dengan id ${id}` });

      const data = {
        name: name ? name : oldCategory.name,
      };

      const category = await CategoryModel.update(id, data);

      res.json({
        code: 200,
        message: `Sukses update data dengan id ${id}`,
        data: {
          id: id,
          oldName: oldCategory.name,
          name: data.name
        },
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const oldCategory = await CategoryModel.findById(id);

      if (!oldCategory)
        return res
          .status(404)
          .json({ message: `Tidak ada Kategori dengan id ${id}` });

      const category = await CategoryModel.delete(id);
      res.json({
        code: 200,
        message: `Sukses hapus data dengan id ${id}`,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getCoursesCount: async (req, res) => {
    try {
      const countCourses = await CategoryModel.getCoursesCount();
      res.status(200).json({
        message: "Sukses tampilkan jumlah course per kategori",
        data: countCourses,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CategoryController;
