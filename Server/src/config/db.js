const { Sequelize } = require("sequelize");
require('dotenv').config()

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not defined');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

const connectDB = async () => {
    try {
       await sequelize.authenticate();
        console.log("DataBase connected successfully");
        
    } catch (error) {
        console.log(`Error while connecting the db ${error}`);
        process.exit(1);
    }
}

module.exports = { connectDB, sequelize };