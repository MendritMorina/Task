// Imports: third-party packages.
const { ValidationError } = require("express-validation");

// Local file imports.
const ApiError = require("../configs/apiError");
const httpCodes = require("../configs/httpCodes");

// Middleware that is used to handle errors in our API.
const errorHandler = (error, request, response, next) => {
  const errMessage = error.message || "Internal Server Error!";
  const errCode = error.httpCode || httpCodes.INTERNAL_ERROR;

  const err = new ApiError(errMessage, errCode);

  if (error instanceof ValidationError) {
    err.httpCode = httpCodes.BAD_REQUEST;
    err.message = Object.keys(error.details[0])
      .map((key) => error.details[0][key])
      .join(", ");
  }

  const errorPayload = { success: false, error: err.message, errCode };

  response.status(err.httpCode).json(errorPayload);
  return;
};

// Exports of this file.
module.exports = errorHandler;
