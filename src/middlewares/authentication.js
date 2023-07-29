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

  console.log(token);
  //token is
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzRlNDIwYzBlYmQ4ZWY3ZjYyZjBhYyIsImRhdGEiOiJtZW5kcml0IiwiaWF0IjoxNjkwNjMzMTUxLCJleHAiOjE2OTMyMjUxNTF9.WFpG1q0zx0_YX5TXYTEHCZqBa6o2iRgzj_bNjAX8tWc

  const decodedResult = await decode(token);
  console.log(decodedResult);
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
