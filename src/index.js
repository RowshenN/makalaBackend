const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const path = require("path");
const fs = require("fs");
const app = express();

const uploadRoutes = require("./routes/upload.routes");

// import routes
const articleRoutes = require("./routes/article.routes");
const categoryRoutes = require("./routes/category.routes");
const magazineRoutes = require("./routes/magazine.routes");
const issueRoutes = require("./routes/issue.routes");
const authorRoutes = require("./routes/author.routes");

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/article", articleRoutes);
app.use("/category", categoryRoutes);
app.use("/magazine", magazineRoutes);
app.use("/issue", issueRoutes);
app.use("/author", authorRoutes);

app.use("/upload", uploadRoutes); // ✅ BEFORE static (important)
app.use("/upload", express.static(path.join(__dirname, "upload")));

// ✅ start server ONLY after DB is ready
const startServer = async () => {
  try {
    const uploadDir = path.join(__dirname, "src", "upload");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Upload directory created 📁");
    }

    await sequelize.authenticate();
    console.log("Database connected ✅");

    await sequelize.sync({ alter: true });
    app.listen(5000, () => {
      console.log("Server running on port 5000 🚀");
    });
  } catch (error) {
    console.error("Server error:", error);
  }
};

startServer();
