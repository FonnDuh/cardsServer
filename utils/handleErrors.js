const chalk = require("chalk");
const createError = (validator, message, status) => {
  const msgStr = String(message);
  if (msgStr.startsWith(`${validator} Error:`)) {
    const error = new Error(msgStr);
    error.status = status || 400;
    throw error;
  }
  const error = new Error(`${validator} Error: ${msgStr}`);
  error.status = status || 400;
  throw error;
};

const handleError = (res, status, message = "") => {
  res.locals.errorMessage = message;
  console.log(chalk.redBright(message));
  return res.status(status).send(message);
};

module.exports = { createError, handleError };
