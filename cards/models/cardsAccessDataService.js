const { createError } = require("../../utils/handleErrors");
const Card = require("./mongodb/Card");
require("dotenv").config();

const DB = process.env.DB || "MONGO_DB";

// Create Card
const createCard = async (newCard) => {
  if (DB === "MONGO_DB") {
    try {
      let card = new Card(newCard);
      card = await card.save();
      return card;
    } catch (error) {
      return createError("Mongoose: ", error.message || "Error creating card.");
    }
  }

  //   if (DB === "MYSQL") {
  //     try {
  //     } catch (error) {}
  //   }

  //   if (DB === "POSTGRES") {}
};

// Get Cards
const getAllCards = async () => {
  if (DB === "MONGO_DB") {
    try {
      const cards = await Card.find();
      return cards;
    } catch (error) {
      return createError(
        "Mongoose: ",
        error.message || "Error fetching cards.",
        500
      );
    }
  }
};

// Get Card by ID
const getCardById = async (cardId) => {
  if (DB === "MONGO_DB") {
    try {
      const card = await Card.findById(cardId);
      return card;
    } catch (error) {
      return createError(
        "Mongoose: ",
        error.message || "Error fetching card by ID."
      );
    }
  }
};

// Get My Cards
const getMyCards = async (userId) => {
  if (DB === "MONGO_DB") {
    try {
      const cards = await Card.find({ user_id: userId });
      return cards;
    } catch (error) {
      return createError(
        "Mongoose: ",
        error.message || "Error fetching user's cards."
      );
    }
  }
};

// Update Card
const updateCard = async (cardId, updatedCard) => {
  if (DB === "MONGO_DB") {
    try {
      const card = await Card.findByIdAndUpdate(cardId, updatedCard, {
        new: true,
      });
      return card;
    } catch (error) {
      return createError("Mongoose: ", error.message || "Error updating card.");
    }
  }
};

// Delete Card
const deleteCard = async (cardId) => {
  if (DB === "MONGO_DB") {
    try {
      const card = await Card.findByIdAndDelete(cardId);
      return card;
    } catch (error) {
      return createError("Mongoose: ", error.message || "Error deleting card.");
    }
  }
};

// Like Card
const likeCard = async (cardId, userId) => {
  if (DB === "MONGO_DB") {
    try {
      const card = await Card.findById(cardId);
      if (!card) return createError("Mongoose", "Card not found");

      if (card.likes.includes(userId))
        card.likes = card.likes.filter((like) => like !== userId);
      else card.likes.push(userId);
      await card.save();
      return card;
    } catch (error) {
      return createError("Mongoose: ", error.message || "Error liking card.");
    }
  }
};

module.exports = {
  createCard,
  getAllCards,
  getCardById,
  getMyCards,
  updateCard,
  deleteCard,
  likeCard,
};
