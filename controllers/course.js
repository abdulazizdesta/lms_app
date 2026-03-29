const CourseModel = require("../models/course");

const CourseController = {
  getAll: async (req, res) => {
    try {
      const courses = await CourseModel.findAll();
      res.json({
        code: 200,
        message: "Sukses tampilkan semua data",
        data: courses,
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
      const courses = await CourseModel.findById(id);
      if (!courses)
        return res
          .status(404)
          .json({ message: `Data dengan id ${id} tidak ditemukan` });
      res.json({
        code: 200,
        message: `Sukses tampilkan data dengan id ${id}`,
        data: courses,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  store: async (req, res) => {
    try {
      const { title, description, price, category_id, instructor_id } =
        req.body;

      if (!title || !description || !price || !category_id || !instructor_id) {
        return res.status(400).json({ message: "Dibutuhkan Semua Data" });
      }

      const data = {
        title: title,
        description: description,
        price: price,
        category_id: category_id,
        instructor_id: instructor_id,
      };

      const courses = await CourseModel.store(data);

      res.status(201).json({
        message: "Sukses menambahkan data",
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          instructor_id: data.instructor_id,
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
      const { title, description, price, category_id, instructor_id } =
        req.body;

      const oldCourse = await CourseModel.findById(id);

      if (!oldCourse)
        return res
          .status(404)
          .json({ message: `Tidak ada Course dengan id ${id}` });

      const data = {
        title: title ? title : oldCourse.title,
        description: description ? description : oldCourse.description,
        price: price ? price : oldCourse.price,
        category_id: category_id ? category_id : oldCourse.category_id,
        instructor_id: instructor_id ? instructor_id : oldCourse.instructor_id,
      };

      const course = await CourseModel.update(id, data);

      res.json({
        code: 200,
        message: `Sukses update data dengan id ${id}`,
        data: {
          id: id,
          oldTitle: oldCourse.title,
          title: data.title,
          description: data.description,
          price: data.price,
          category_id: data.category_id,
          instructor_id: data.instructor_id
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
      const oldCourse = await CourseModel.findById(id);

      if (!oldCourse)
        return res
          .status(404)
          .json({ message: `Tidak ada Course dengan id ${id}` });

      const courses = await CourseModel.delete(id);
      res.json({
        code: 200,
        message: `Sukses hapus data dengan id ${id}`,
        course: oldCourse,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getStudentsCount: async (req, res) => {
    try {
      const countStudents = await CourseModel.getStudentsCount();
      res.status(200).json({
        message: "Sukses tampilkan jumlah Pendaftaran per Course",
        data: countStudents,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

showCategoryName: async (req, res) => {
    try {
      const showCategory = await CourseModel.showCategoryName();
      res.status(200).json({
        message: "Sukses tampilkan Data",
        data: showCategory,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CourseController;
