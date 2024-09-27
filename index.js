// Packages
import path from "path";
import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// Utils
import ConnectDB from "./config/db.js";
import userRouter from "./routes/UsersRouter.js";
import CategoriesRouter from "./routes/CategoriesRoutes.js";
import ProductsRouter from "./routes/ProductsRoutes.js";
import UploadImage from "./routes/UploadImagesRoutes.js";
import OrderRoutes from "./routes/OrderRoutes.js";
import mongoose from "mongoose";
// ========
config();
const port = process.env.PORT || 5000;

const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    // allowedHeaders: ["Content-Type", "Authorization"],

    credentials: true,
  })
);

// app.use(function (req, res, next) {
//   //Enabling CORS
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization"
//   );
//   next();
// });

// app.use(cors());

// app.use(function (req, res, next) {
//   res.header(
//     "Access-Control-Allow-Origin",
//     "https://ecommerce-frontend-blond-one.vercel.app"
//   ); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

app.listen(port, () => {
  console.log(`Server running on port: ${port} `);
});

mongoose
  .connect(
    "mongodb+srv://marwanmamdouh159:uPdjEVXOeNA59qUU@cluster0.cmb4e.mongodb.net/E-Commerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Database is connected✌️"))
  .catch((error) => console.log(error));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const __dirname = path.resolve();
console.log(__dirname, "dirname");

app.use(
  "/uploads/images",
  express.static(path.join(__dirname + "/uploads/images"))
);

app.get("/api/config/paypal", (req, res, next) => {
  res.send({
    ClinetId: process.env.PAYPAL_CLIENT_ID,
    ClientEmail: process.env.PAYPAL_EMAIL,
    message: "done",
  });
});

app.get("/", (req, res) => {
  return res.json({ message: "Done" });
});
app.use("/api/user", userRouter);
app.use("/api/category", CategoriesRouter);
app.use("/api/product", ProductsRouter);
app.use("/api/uploads", UploadImage);
app.use("/api/order", OrderRoutes);
