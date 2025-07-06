const express = require("express");
const {
  createCard,
  getAllCards,
  getMyCards,
  getCardById,
  updateCard,
  deleteCard,
  likeCard,
} = require("../models/cardsAccessDataService");
const auth = require("../../auth/authService");
const normalizeCard = require("../helpers/normalizeCard");
const { handleError, createError } = require("../../utils/handleErrors");
const cardValidation = require("../validation/cardValidationService");
const Card = require("../models/mongodb/Card");
const router = express.Router();

// Create a new card
router.post("/", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness)
      return createError(
        "Authentication",
        "Only business users can create cards.",
        403
      );

    const errorMsg = cardValidation(req.body);
    if (errorMsg !== "") {
      return createError("Validation", errorMsg, 400);
    }

    const normalizedCard = await normalizeCard(req.body, userInfo._id);
    const card = await createCard(normalizedCard);
    res.status(201).send(card);
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Get all cards
router.get("/", async (req, res) => {
  try {
    const allCards = await getAllCards();
    res.status(200).send(allCards);
  } catch (error) {
    return handleError(res, 403, error.message);
  }
});

// Get my cards
router.get("/my-cards", auth, async (req, res) => {
  try {
    const userInfo = req.user;
    if (!userInfo.isBusiness)
      return createError(
        "Authentication",
        "Only business users can view their cards.",
        403
      );
    const cards = await getMyCards(userInfo.id);
    res.status(200).send(cards);
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Get card by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const card = await getCardById(id);
    res.status(200).send(card);
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});

// Update card
router.put("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const originalCard = await getCardById(id);
    const userInfo = req.user;
    if (
      !userInfo.isAdmin &&
      String(userInfo._id) !== String(originalCard.user_id)
    ) {
      return createError(
        "Authentication",
        "You can only update your own cards.",
        403
      );
    }

    const errorMsg = cardValidation(req.body);
    if (errorMsg !== "") {
      return createError("Validation", errorMsg, 400);
    }

    // Prevent bizNumber change via update
    req.body.bizNumber = originalCard.bizNumber;

    const normalizedCard = await normalizeCard(req.body, userInfo._id);
    const card = await updateCard(id, normalizedCard);
    res.status(200).send(card);
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});

// Delete card
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const originalCard = await getCardById(id);
    const userInfo = req.user;
    if (
      !userInfo.isAdmin &&
      String(userInfo._id) !== String(originalCard.user_id)
    ) {
      return createError(
        "Authentication",
        "You can only delete your own cards.",
        403
      );
    }
    const card = await deleteCard(id);
    res.status(200).send(card);
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Like card
router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userinfo = req.user;
  try {
    const card = await likeCard(id, userinfo._id);
    res.status(200).send(card);
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});

// Update business number
router.patch("/:id/bizNumber", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { bizNumber } = req.body;
    const userInfo = req.user;

    if (!userInfo.isAdmin) {
      return createError(
        "Authentication",
        "Only admins can change the business number.",
        403
      );
    }

    if (!bizNumber) {
      return createError("Validation", "Business number is required.", 400);
    }

    const cardWithSameBizNumber = await Card.findOne({
      bizNumber,
      _id: { $ne: id },
    });
    if (cardWithSameBizNumber) {
      return createError(
        "Validation",
        "A card with this business number already exists.",
        400
      );
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { bizNumber },
      { new: true }
    );
    if (!updatedCard) {
      return createError("NotFound", "Card not found.", 404);
    }

    res.status(200).send(updatedCard);
  } catch (error) {
    return handleError(res, 400, error.message);
  }
});

module.exports = router;
