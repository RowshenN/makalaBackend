require('dotenv').config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const path = require("path");
const fs = require("fs");
const app = express();

const uploadRoutes = require("./routes/upload.routes");
const articleRoutes = require("./routes/article.routes");
const categoryRoutes = require("./routes/category.routes");
const magazineRoutes = require("./routes/magazine.routes");
const issueRoutes = require("./routes/issue.routes");
const authorRoutes = require("./routes/author.routes");
const authRoutes = require("./routes/auth.routes");
const permissionRoutes = require("./routes/permission.routes");
const userRoutes = require("./routes/user.routes");
const { PORT } = require("./config/env");

// load all model associations
require("./models");

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/permissions", permissionRoutes);
app.use("/users", userRoutes);
app.use("/article", articleRoutes);
app.use("/category", categoryRoutes);
app.use("/magazine", magazineRoutes);
app.use("/issue", issueRoutes);
app.use("/author", authorRoutes);

app.use("/upload", uploadRoutes);
app.use("/upload", express.static(path.join(__dirname, "upload")));

const startServer = async () => {
  try {
    const uploadDir = path.join(__dirname, "upload");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Upload directory created 📁");
    }

    await sequelize.authenticate();
    console.log("Database connected ✅");

    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  } catch (error) {
    console.error("Server error:", error);
  }
};

startServer();
