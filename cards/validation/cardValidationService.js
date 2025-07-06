const cardValidate = require("./joi/cardValidate");
require("dotenv").config();

const VALIDATOR = process.env.VALIDATOR || "Joi";

const cardValidation = (card) => {
  if (VALIDATOR === "Joi") {
    const { error } = cardValidate(card);
    if (error) return error.details.map((detail) => detail.message);
    return "";
  }
};

module.exports = cardValidation;
