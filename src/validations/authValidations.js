const emailValidator = require("email-validator");
const validator = require("validator");

const isValidEmail = (email) => {
  return validator.isEmail(email);
};

const validationSignUp = (fullName, username, password, email) => {
  if (!fullName || typeof fullName !== "string") {
    return {
      success: false,
      message: "Full name is required and must be a string.",
    };
  }

  if (!username || typeof username !== "string") {
    return {
      success: false,
      message: "Username is required and must be a string.",
    };
  }

  if (!isValidEmail(email)) {
    return {
      success: false,
      message: "Email is required and must be a valid email address.",
    };
  }

  if (!password || typeof password !== "string") {
    return {
      success: false,
      message: "Password is required and must be a string.",
    };
  }

  return {
    success: true,
  };
};

module.exports = { validationSignUp };
