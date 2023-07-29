const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Base = require("./base");

// User Schema that is used to represent single User in our API.
const UserSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  ...Base,
});

// Statics & instance methods.
UserSchema.statics.passwordChangedAfter = function (
  passwordChangedAt,
  tokenIat
) {
  if (!passwordChangedAt) return false;

  return new Date(passwordChangedAt) > new Date(tokenIat);
};

UserSchema.statics.comparePasswords = async function (
  candidatePassword,
  hashedPassword
) {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

// Hooks & middlewares.
UserSchema.pre("save", async function (next) {
  if (this.isNew) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(this.password, salt);

    this.password = hash;
  }

  next();
});

// Exports of this file.
module.exports = mongoose.model("User", UserSchema);
