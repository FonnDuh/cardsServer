const mongoose = require("mongoose");
const chalk = require("chalk");
require("dotenv").config();

const connectionString = process.env.MONGO_ATLAS_URI;

const connectToAtlas = async () => {
  try {
    await mongoose.connect(connectionString);
    console.log(
      chalk.white.bold.bgBlue("Connected to MongoDB Atlas")
    );
  } catch (error) {
    console.error(chalk.red("Error connecting to MongoDB Atlas: ", error));
    throw new Error("Failed to connect to MongoDB Atlas");
  }
};

module.exports = connectToAtlas;
