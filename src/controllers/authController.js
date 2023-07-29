// Imports: local files.
const User = require("../models/userModel");
const ApiError = require("../configs/apiError");
const jwt = require("../configs/jwt");
// const asyncHandler = require("../middlewares/asyncHandler");
const asyncHandler = require("express-async-handler");
const httpCodes = require("../configs/httpCodes");
const { validationSignUp } = require("../validations/authValidations");
console.log(validationSignUp);

/**
 * @description Register.
 * @route       POST /api/auth/signup.
 */
const signup = asyncHandler(async (request, response, next) => {
  const { full_name, username, email, password } = request.body;

  const validation = validationSignUp(full_name, username, email, password);

  if (!validation.success) {
    next(new ApiError(validation.message, httpCodes.BAD_REQUEST));
    return;
  }

  const userExists =
    (await User.countDocuments({ email, isDeleted: false })) > 0;
  if (userExists) {
    next(new ApiError("User already exists!", httpCodes.BAD_REQUEST));
    return;
  }

  const user = await User.create({ full_name, username, email, password });
  if (!user) {
    next(new ApiError("Failed to create user!", httpCodes.INTERNAL_ERROR));
    return;
  }

  const jwtResult = await jwt.sign({
    id: user._id,
    data: user.email,
  });

  if (!jwtResult.success) {
    next(new ApiError(jwtResult.error, httpCodes.INTERNAL_ERROR));
    return;
  }

  const { encoded } = jwtResult.data;

  response.status(httpCodes.CREATED).json({ success: true, token: encoded });
});

/**
 * @description Login.
 * @route       POST /api/auth/login.
 */
const login = asyncHandler(async (request, response, next) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username, isDeleted: false }).select(
    "_id username password email"
  );
  if (!user) {
    next(new ApiError("Invalid Credentials!", httpCodes.UNAUTHORIZED));
    return;
  }

  const samePassword = await User.comparePasswords(password, user.password);
  if (!samePassword) {
    next(new ApiError("Invalid Credentials!", httpCodes.UNAUTHORIZED));
    return;
  }

  const jwtResult = await jwt.sign({
    id: user._id,
    data: username,
  });

  if (!jwtResult.success) {
    next(new ApiError(jwtResult.error, httpCodes.INTERNAL_ERROR));
    return;
  }

  const { encoded } = jwtResult.data;
  response.status(httpCodes.CREATED).json({ success: true, token: encoded });
});

/**
 * @description MyProfile.
 * @route       GET /api/auth/my-profile.
 */
const myprofile = asyncHandler(async (request, response, next) => {
  const { full_name, username, email } = request.user;

  if (!request.user) {
    next(new ApiError("User not authenticated.", httpCodes.UNAUTHORIZED));
  }

  const profile = { full_name, username, email };

  response.status(httpCodes.OK).json({ success: true, profile });
});

// Exports of this file.
module.exports = { signup, login, myprofile };
