// const asyncHandler = require("./asyncHandler");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const ApiError = require("../configs/apiError");
const { sign, decode } = require("../configs/jwt");
const httpCodes = require("../configs/httpCodes");

const authentication = asyncHandler(async (request, response, next) => {
  const { authorization } = request.headers;
  if (!authorization) {
    next(new ApiError("Missin auth header", httpCodes.UNAUTHORIZED));
    return;
  }

  const [bearer, token] = authorization.split(" ");
  if (!bearer || bearer !== "Bearer" || !token) {
    next(new ApiError("Wrong auth header", httpCodes.UNAUTHORIZED));
  }

  const decodedResult = await decode(token);
  if (!decodedResult.success) {
    next(new ApiError(decodedResult.error, httpCodes.UNAUTHORIZED));
    return;
  }

  const { decoded } = decodedResult.data;

  const user = await User.findOne({ _id: decoded.id, isDeleted: false });
  if (!user) {
    next(new ApiError("Unauthorized", httpCodes.UNAUTHORIZED));
    return;
  }

  const iat = new Date(0);
  iat.setUTCMilliseconds(decoded.iat * 1000);

  const passwordChanged = User.passwordChangedAfter(
    user.passwordChangedAt,
    iat
  );
  if (passwordChanged) {
    next(new ApiError("Unauthorized", httpCodes.UNAUTHORIZED));
    return;
  }

  request.user = user;
  next();
});

// Exports of this file.
module.exports = authentication;
