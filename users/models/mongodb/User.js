const mongoose = require("mongoose");
const Name = require("../../../helpers/mongodb/Name");
const { PHONE, EMAIL } = require("../../../helpers/mongodb/mongooseValidator");
const Address = require("../../../helpers/mongodb/Address");
const Image = require("../../../helpers/mongodb/Image");
const { lock } = require("../../routes/userRestController");

const userSchema = new mongoose.Schema({
  name: Name,
  phone: PHONE,
  email: EMAIL,
  password: {
    type: String,
    minLength: 7,
    maxLength: 1024,
    required: true,
    trim: true,
  },
  image: Image,
  address: Address,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isBusiness: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
