require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'admin',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_DATABASE || 'jumpnet_dev',
    host: process.env.DB_HOST || 'postgres', // Default fallback to 'localhost'
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
  },
};
