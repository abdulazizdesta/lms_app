const UserModel = require("../models/user");

const UserController = {
  getAll: async (req, res) => {
    try {
      const users = await UserModel.findAll();
      res.json({
        code: 200,
        message: "Sukses tampilkan semua data",
        data: users,
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
      const users = await UserModel.findById(id);
      if (!users)
        return res
          .status(404)
          .json({ message: `Data dengan id ${id} tidak ditemukan` });
      res.json({
        code: 200,
        message: `Sukses tampilkan data dengan id ${id}`,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  store: async (req, res) => {
    try {
      const { name, email, role } = req.body;

      if (!name || !email || !role ) {
        return res.status(400).json({ message: "Dibutuhkan Semua Data" });
      }

      const data = {
        name: name,
        email: email,
        role: role
      };

      const users = await UserModel.store(data);
      res.status(201).json({
        message: "Sukses menambahkan data",
        data: {
          id: users.insertId,
          name: data.name,
          email: data.email,
          role: data.role
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
      const { name, email, role } = req.body;

      const oldUser = await UserModel.findById(id);

      if (!oldUser)
        return res
          .status(404)
          .json({ message: `Tidak ada User dengan id ${id}` });

      const data = {
        name: name ? name : oldUser.name,
        email: email ? email : oldUser.email,
        role: role ? role : oldUser.role
      };

      const user = await UserModel.update(id, data);

      res.json({
        code: 200,
        message: `Sukses update data dengan id ${id}`,
        data: {
          id: id,
          oldName: oldUser.name,
          name: data.name,
          email: data.email,
          role: data.role
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
      const oldUser = await UserModel.findById(id);

      if (!oldUser)
        return res
          .status(404)
          .json({ message: `Tidak ada User dengan id ${id}` });

      const user = await UserModel.delete(id);
      res.json({
        code: 200,
        message: `Sukses hapus data dengan id ${id}`,
        user: oldUser
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },

  getEnrollmentsCount: async (req, res) => {
    try {
      const countEnrollments = await UserModel.getEnrollmentsCount();
      res.status(200).json({
        message: "Sukses tampilkan jumlah Pendaftaran per User",
        data: countEnrollments,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = UserController;
