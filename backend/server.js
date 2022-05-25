import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//route imports
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Home");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

//Custom middleware : not found
app.use(notFound);

//Custom middleware : error handling
app.use(errorHandler);

const Port = process.env.PORT || 5000;
app.listen(
  Port,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${Port}`.yellow
  )
);
