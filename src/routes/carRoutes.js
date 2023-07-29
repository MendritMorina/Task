const express = require("express");
const router = express.Router();

const {
  filter,
  getAll,
  getOne,
  create,
  updateOne,
  deleteOne,
} = require("../controllers/carController");
const authentication = require("../middlewares/authentication");

router.get("/", getAll);
router.post("/create", create);
router.put("/:carId", updateOne);
router.get("/rental-cars", filter);
router.get("/:carId", getOne);
router.delete("/:carId", deleteOne);

module.exports = router;
