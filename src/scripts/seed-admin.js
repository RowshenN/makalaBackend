require("dotenv").config();

const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");
const User = require("../models/user.model");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@makala.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin1234!";
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected ✅");

    await User.sync({ alter: true });

    const existing = await User.findOne({ where: { email: ADMIN_EMAIL } });
    if (existing) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.create({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: ADMIN_NAME,
      role: "admin",
    });

    console.log("Admin created successfully:");
    console.log(`   Email:    ${admin.email}`);
    console.log(`   Name:     ${admin.name}`);
    console.log(`   Role:     ${admin.role}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);

    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
