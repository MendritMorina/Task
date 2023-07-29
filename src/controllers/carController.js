const Car = require("../models/carModel");
const ApiError = require("../configs/apiError");
const asyncHandler = require("express-async-handler");
const httpCodes = require("../configs/httpCodes");

/**
 * @description Filter all Cars.
 * @route       GET /api/cars/rental-cars.
 */
const filter = asyncHandler(async (request, response) => {
  const { year, color, steering_type, number_of_seats } = request.query;

  const filter = {};
  if (year) filter.year = year;
  if (color) filter.color = color;
  if (steering_type) filter.steering_type = steering_type;
  if (number_of_seats) filter.number_of_seats = number_of_seats;

  // sort the cars in descending order (lowest to hightes price) , if (hightes to lowest price) price:-1
  const cars = await Car.find(filter).sort({ price: 1 });

  response.status(httpCodes.OK).json({ success: true, cars });
});

/**
 * @description Get all Cars.
 * @route       GET /api/cars.
 */
const getAll = asyncHandler(async (request, response) => {
  const cars = await Car.find({});

  if (!cars) {
    next(new ApiError("Cars not found!", httpCodes.NOT_FOUND));
    return;
  }

  response.status(httpCodes.OK).json({ success: true, cars, error: null });
});

/**
 * @description Get Car by id.
 * @route       GET /api/cars/:carId.
 */
const getOne = asyncHandler(async (request, response, next) => {
  const { carId } = request.params;
  const car = await Car.findOne({ _id: carId });
  if (!car) {
    next(new ApiError("Car with given id not found!", httpCodes.NOT_FOUND));
    return;
  }
  response.status(httpCodes.OK).json({ success: true, car, error: null });
});

/**
 * @description Create a Car.
 * @route       POST /api/car.
 */
const create = asyncHandler(async (request, response, next) => {
  const { name, price_per_day, year, color, steering_type, number_of_seats } =
    request.body;

  const payload = {
    name,
    price_per_day,
    year,
    color,
    steering_type,
    number_of_seats,
    // createdBy: userId,
  };

  const car = await Car.create(payload);
  if (!car) {
    next(new ApiError("Failed to create new car!", httpCodes.INTERNAL_ERROR));
    return;
  }

  response.status(httpCodes.CREATED).json({ success: true, car });
});

/**
 * @description Update a Car.
 * @route       PUT /api/cars/:carId.
 */
const updateOne = asyncHandler(async (request, response, next) => {
  const { carId } = request.params;
  const { name, price_per_day, year, color, steering_type, number_of_seats } =
    request.body;

  const car = await Car.findOne({ _id: carId });
  if (!car) {
    next(new ApiError("Car not found!", httpCodes.NOT_FOUND));
    return;
  }

  const payload = {
    name,
    price_per_day,
    year,
    color,
    steering_type,
    number_of_seats,
  };

  const editedCar = await Car.findOneAndUpdate(
    { _id: car._id },
    {
      $set: payload,
    },
    { new: true }
  );

  if (!editedCar) {
    next(new ApiError("Failed to update car!", httpCodes.INTERNAL_ERROR));
    return;
  }

  response.status(httpCodes.CREATED).json({ success: true, editedCar });
});

/**
 * @description Delete a Car.
 * @route       DELETE /api/cars/:carId.
 */
const deleteOne = asyncHandler(async (request, response, next) => {
  const { carId } = request.params;

  const car = await Car.findOne({ _id: carId });
  if (!car) {
    next(new ApiError("Car not found!", httpCodes.NOT_FOUND));
    return;
  }

  const deletedCar = await Car.deleteOne({ _id: carId });

  if (!deletedCar) {
    next(new ApiError("Failed to delete car!", httpCodes.INTERNAL_ERROR));
    return;
  }

  response
    .status(httpCodes.OK)
    .json({ success: true, message: "Car deleted successfully" });
});

// Exports of this file.
module.exports = {
  filter,
  getAll,
  getOne,
  create,
  updateOne,
  deleteOne,
};
