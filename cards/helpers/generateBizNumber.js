const _ = require("lodash");
const Card = require("../models/mongodb/Card");
const { createError } = require("../../utils/handleErrors");

const generateBizNumber = async () => {
  const cardsCount = Card.countDocuments();
  if (cardsCount === 8_999_999)
    return createError(
      "Mongoose",
      "Maximum number of cards reached, cannot generate more business numbers.",
      409
    );

  let randomNumber = _.random(1_000_000, 8_999_999);
  do {
    randomNumber = _.random(1_000_000, 8_999_999);
  } while (await bizNumberExists(randomNumber));

  return randomNumber;
};

const bizNumberExists = async (bizNumber) => {
  try {
    const exists = await Card.findOne({ bizNumber });
    return Boolean(exists);
  } catch (error) {
    throw createError(
      "Mongoose",
      error.message || "Error checking business number existence.",
      500
    );
  }
};

module.exports = {
  generateBizNumber,
  bizNumberExists,
};
