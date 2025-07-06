const express = require("express");
const {
  registerUser,
  getUserByID,
  getAllUsers,
  loginUser,
  updateUser,
  changeBusinessStatus,
  deleteUser,
} = require("../models/userAccessDataService");
const auth = require("../../auth/authService");
const returnUser = require("../helpers/returnUser");
const { createError, handleError } = require("../../utils/handleErrors");
const {
  validateRegister,
  validateLogin,
} = require("../validation/userValidationService");

const router = express.Router();

// Register a new user
router.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    const validationErrors = validateRegister(newUser);

    if (validationErrors != "")
      return createError("Validation", validationErrors, 400);

    const user = await registerUser(newUser);
    res.status(201).send(returnUser(user));
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userInfo = req.user;
    if (!userInfo.isAdmin && userInfo._id != id)
      return createError(
        "Authentication",
        "Access denied. You can only view your own profile or if you are an admin.",
        403
      );
    const user = await getUserByID(id);
    if (!user) {
      return createError("NotFound", "User not found", 404);
    }
    res.status(200).send(user);
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Get all users
router.get("/", auth, async (req, res) => {
  let userInfo = req.user;

  try {
    if (!userInfo.isAdmin) {
      throw createError(
        "Authorization",
        "Only admin user can get all users list",
        403
      );
    }
    let users = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const validationErrors = validateLogin(req.body);

    if (validationErrors != "")
      return createError("Validation", validationErrors, 400);

    const token = await loginUser(email, password);
    res.status(200).send({ token });
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Update user
router.put("/:id", auth, async (req, res) => {
  let userInfo = req.user;
  let updatedUser = req.body;
  const { id } = req.params;
  try {
    if (userInfo._id !== id && !userInfo.isAdmin) {
      throw createError(
        "Authorization",
        "Only the own user can edit is details or if you are an admin.",
        403
      );
    }

    const errorMessage = validateRegister(req.body);
    if (errorMessage != "") {
      return createError("Validation", errorMessage, 400);
    }
    console.log(updatedUser);
    let user = await updateUser(id, updatedUser);
    console.log(user);
    res.status(201).send(returnUser(user));
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Change business status
router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const userInfo = req.user;
  try {
    if (userInfo._id !== id) {
      throw createError(
        "Authorization",
        "You can only change your own business status.",
        403
      );
    }

    let user = await changeBusinessStatus(id);
    res.status(201).send(returnUser(user));
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

// Delete user
router.delete("/:id", auth, async (req, res) => {
  const { id } = req.params;
  let userInfo = req.user;

  try {
    if (!userInfo.isAdmin && userInfo._id !== id) {
      throw createError(
        "Authorization",
        "You can only delete your own profile or if you are an admin.",
        403
      );
    }

    let user = await deleteUser(id);
    res.status(200).send(returnUser(user));
  } catch (error) {
    return handleError(res, error.status, error.message);
  }
});

module.exports = router;
