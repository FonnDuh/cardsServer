const { verifyToken } = require("./providers/jwt");
const { createError, handleError } = require("../utils/handleErrors");
require("dotenv").config();

const TOKEN_GENERATOR = process.env.TOKEN_GENERATOR || "jwt";

const auth = (req, res, next) => {
  if (TOKEN_GENERATOR === "jwt") {
    try {
      const token = req.header("x-auth-token");
      if (!token) {
        return createError("Authentication", "Please login for token.", 401);
      }

      const userInfo = verifyToken(token);
      if (!userInfo) {
        return createError(
          "Authentication",
          "Invalid authentication token.",
          403
        );
      }

      req.user = userInfo;
      return next();
    } catch (error) {
      return handleError(res, error.status, error.message);
    }
  }
  return handleError(
    res,
    500,
    "Authentication method not supported. Please contact support."
  );
};

module.exports = auth;
