const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

const MONGO_DB_LOCAL = process.env.MONGO_LOCAL_URI;
const connectToLocalDB = async () => {
  try {
    await mongoose.connect(MONGO_DB_LOCAL);
    console.log(chalk.white.bold.bgBlue("Connected to MongoDB Locally"));
  } catch (error) {
    console.error(chalk.red("Error connecting to MongoDB Locally:"), error);
    throw new Error("Failed to connect to MongoDB Locally");
  }
};

module.exports = connectToLocalDB;
