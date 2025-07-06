const express = require("express");
const chalk = require("chalk");
const connectToDB = require("./db/dbService");
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { handleError } = require("./utils/handleErrors");
const loggerMiddleware = require("./logger/loggerService");

const app = express();
const PORT = 8181;

app.use(express.json());
app.use(express.static("./public"));

app.use(loggerMiddleware());

app.use(corsMiddleware);

app.use(router);

app.use((err, req, res, next) => {
  console.error("Error occurred:", err);
  return handleError(res, 500, "An unexpected error occurred.");
});

app.listen(PORT, () => {
  console.log(chalk.green.bold.bgCyan(`Server is running on port ${PORT}`));
  console.log(chalk.blue("Connecting to the database..."));
  connectToDB();
});
