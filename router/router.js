const express = require("express");
const { handleError } = require("../utils/handleErrors");
const router = express.Router();

router.use("/cards", require("../cards/routes/cardRestController"));
router.use("/users", require("../users/routes/userRestController"));

router.use((req, res) => {
  return handleError(res, 404, "Route not found.");
});

module.exports = router;
