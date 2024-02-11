import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import path from "path";
import morgan from "morgan";
import colors from "colors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

//route imports
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

//paypal
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);
//razorpay
app.get("/api/config/razorpay", (req, res) =>
  res.send(process.env.RAZORPAY_KEY_ID)
);
const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "..", "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => {
    res.send("Home");
  });
}

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

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
