const { User } = require("../models");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email", "name", "role", "createdAt"],
      order: [["createdAt", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (id === req.user.id && role && role !== req.user.role) {
      return res.status(403).json({ message: "Cannot change your own role" });
    }

    if (role) user.role = role;
    if (name !== undefined) user.name = name;

    await user.save();

    res.json({
      message: "User updated",
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(403).json({ message: "Cannot delete yourself" });
    }

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };
