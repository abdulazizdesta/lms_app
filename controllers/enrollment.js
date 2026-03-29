const EnrollmentModel = require("../models/enrollment");

const EnrollmentController = {
  getAll: async (req, res) => {
    try {
      const enrollments = await EnrollmentModel.findAll();
      res.status(200).json({
        message: "Sukses tampilkan semua data",
        data: enrollments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const enrollment = await EnrollmentModel.findById(id);
      if (!enrollment)
        return res
          .status(404)
          .json({ message: `Data dengan id ${id} tidak ditemukan` });
      res.status(200).json({
        message: `Sukses tampilkan data dengan id ${id}`,
        data: enrollment,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  store: async (req, res) => {
    try {
      const { user_id, course_id } = req.body;
      if (!user_id || !course_id)
        return res
          .status(400)
          .json({ message: "user_id dan course_id dibutuhkan" });

      const data = { user_id, course_id };
      const enrollment = await EnrollmentModel.store(data);
      res.status(201).json({
        message: "Sukses menambahkan data",
        data: { id: enrollment.insertId, ...data },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const { user_id, course_id } = req.body;

      const oldEnrollment = await EnrollmentModel.findById(id);
      if (!oldEnrollment)
        return res
          .status(404)
          .json({ message: `Tidak ada data dengan id ${id}` });

      const data = {
        user_id: user_id ? user_id : oldEnrollment.user_id,
        course_id: course_id ? course_id : oldEnrollment.course_id,
      };

      await EnrollmentModel.update(id, data);
      res.status(200).json({
        message: `Sukses update data dengan id ${id}`,
        data: { id, ...data },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const oldEnrollment = await EnrollmentModel.findById(id);
      if (!oldEnrollment)
        return res
          .status(404)
          .json({ message: `Tidak ada data dengan id ${id}` });

      await EnrollmentModel.delete(id);
      res.status(200).json({ message: `Sukses hapus data dengan id ${id}` });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getDetail: async (req, res) => {
    try {
      const enrollments = await EnrollmentModel.getDetail();
      res.status(200).json({
        message: "Sukses tampilkan detail enrollments",
        data: enrollments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = EnrollmentController;
