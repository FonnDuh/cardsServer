const connectToAtlas = require("./mongodb/connectToAtlas");
const connectToLocalDB = require("./mongodb/connectToMongodbLocally");
require("dotenv").config();

const ENVIRONMENT = process.env.ENVIRONMENT || "development";
const DB = process.env.DB || "MONGO_DB";

const connectToDB = async () => {
  if (DB == "MONGO_DB") {
    if (ENVIRONMENT === "development") {
      await connectToLocalDB();
    }
    if (ENVIRONMENT === "production") {
      await connectToAtlas();
    }
  } else if (DB == "MYSQL") {
    console.log("Connecting to MySQL database...");
  }
};

module.exports = connectToDB;
