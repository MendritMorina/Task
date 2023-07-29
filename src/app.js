const dotenv = require("dotenv");
const express = require("express");
const app = express();
const handleMiddleware = require("./middlewares/errorHandler");

dotenv.config();

const connectDB = require("./configs/database");
connectDB();

app.use(express.json());

const authRoute = require("./routes/userRoutes");

app.use("/api/auth", authRoute);

app.use(handleMiddleware);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
