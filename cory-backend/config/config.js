require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "admin",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_DATABASE || "cory_db",
    host: process.env.DB_HOST || "postgres",
    dialect: "postgres",
    port: process.env.DB_PORT || 5432,
  },
  production: {
    use_env_variable: "DATABASE_URL",  // ✅ This is used only in production
    dialect: "postgres",
  },
};