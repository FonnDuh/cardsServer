const { date } = require("joi");
const { generateToken } = require("../../auth/providers/jwt");
const { createError } = require("../../utils/handleErrors");
const { generatePassword, comparePassword } = require("../helpers/bcrypt");
const User = require("./mongodb/User");

// Register new user
const registerUser = async (newUser) => {
  try {
    newUser.password = await generatePassword(newUser.password);
    let user = new User(newUser);
    user = await user.save();
    return user;
  } catch (error) {
    return createError("Mongoose: ", error.message || "Error creating user.");
  }
};

// Get user by ID
const getUserByID = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return createError("Mongoose: ", "User not found.");
    }
    return user;
  } catch (error) {
    return createError(
      "Mongoose: ",
      error.message || "Error fetching user by ID."
    );
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return createError("Mongoose: ", "No users found.");
    }
    return users;
  } catch (error) {
    return createError(
      "Mongoose: ",
      error.message || "Error fetching all users."
    );
  }
};

// User login
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return createError("Authentication", "User not found");
    }
    if (user.lockUntil && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil(
        (user.lockUntil - new Date()) / (1000 * 60 * 60) // in hours
      );
      return createError(
        "Authentication",
        `Account locked. Try again in ${remainingTime} hour(s).`,
        403
      );
    }
    if (!(await comparePassword(password, user.password))) {
      const loginAttempts = (user.loginAttempts || 0) + 1;
      user.loginAttempts = loginAttempts;

      if (loginAttempts >= 3)
        user.lockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await user.save();
      return createError("Authentication", "Email or Password Invalid.");
    }

    // Reset login attempts and lockUntil on successful login
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
    return generateToken(user);
  } catch (error) {
    return createError(
      "Authentication",
      error.message || "Error logging in user."
    );
  }
};

// Update user
const updateUser = async (userId, updatedUser) => {
  try {
    const userFromDB = await User.findById(userId);
    if (!userFromDB) {
      return createError("Authentication: ", "User not found.");
    }
    let user = await User.findByIdAndUpdate(userId, updatedUser);
    if (!user) {
      return createError("Mongoose: ", "Error updating user.");
    }
    user = await user.save();
    return user;
  } catch (error) {
    return createError("Mongoose: ", error.message || "Error updating user.");
  }
};

// Change business status
const changeBusinessStatus = async (id) => {
  let user = await User.findById(id);
  if (!user) {
    return createError("Authentication: ", "User not found.");
  }
  user.isBusiness = !user.isBusiness;
  user = await user.save();
  return user;
};

// Delete user
const deleteUser = async (userId) => {
  try {
    let user = await User.findById(userId);
    if (!user) {
      return createError("Mongoose: ", "User not found.");
    }

    user = await User.findByIdAndDelete(userId);
    if (!user) {
      return createError("Mongoose: ", "Error deleting user.");
    }
    return user;
  } catch (error) {
    return createError("Mongoose: ", error.message || "Error deleting user.");
  }
};

module.exports = {
  registerUser,
  getUserByID,
  getAllUsers,
  loginUser,
  updateUser,
  changeBusinessStatus,
  deleteUser,
};
