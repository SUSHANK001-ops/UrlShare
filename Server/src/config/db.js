const { Sequelize } = require("sequelize");
require('dotenv').config();

function normalizeDatabaseUrl(databaseUrl) {
  const parsedUrl = new URL(databaseUrl);
  parsedUrl.searchParams.delete('sslmode');
  parsedUrl.searchParams.delete('pgbouncer');
  return parsedUrl.toString();
}

function shouldUseSsl(databaseUrl) {
  const parsedUrl = new URL(databaseUrl);
  return !['localhost', '127.0.0.1'].includes(parsedUrl.hostname);
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
}

const databaseUrl = normalizeDatabaseUrl(process.env.DATABASE_URL);
const useSsl = shouldUseSsl(process.env.DATABASE_URL);

const sequelize = new Sequelize(databaseUrl, {
  dialect: "postgres",
  logging: false,
  dialectOptions: useSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : {}
});

const connectDB = async () => {
    try {
       await sequelize.authenticate();
        console.log("DataBase connected successfully");
        
        // Import models so they get registered before sync
        require('../models/shareModel.js');
        
        // Sync models with database (create tables if they don't exist)
        await sequelize.sync({ alter: true });
        console.log("Database tables synchronized successfully");
        
    } catch (error) {
        console.log(`Error while connecting the db ${error}`);
        process.exit(1);
    }
}

module.exports = { connectDB, sequelize };