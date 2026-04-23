const { Author } = require("../models");

// ✅ CREATE
exports.createAuthor = async (req, res) => {
  try {
    const { firstName, lastName, worksAt, studiesAt,phoneNumber } = req.body;

    const author = await Author.create({
      firstName,
      lastName,
      worksAt,
      studiesAt,
      phoneNumber
    });

    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: "Error creating author" });
  }
};

// ✅ GET ALL
exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      attributes: ["id", "firstName", "lastName", "worksAt", "studiesAt", "phoneNumber"],
    });

    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors" });
  }
};

// ✅ GET ONE
exports.getAuthorById = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author" });
  }
};

// ✅ UPDATE
exports.updateAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    await author.update(req.body);

    res.json(author);
  } catch (error) {
    res.status(500).json({ message: "Error updating author" });
  }
};

// ✅ DELETE
exports.deleteAuthor = async (req, res) => {
  try {
    const { id } = req.params;

    const author = await Author.findByPk(id);

    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    await author.destroy();

    res.json({ message: "Author deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting author" });
  }
};
