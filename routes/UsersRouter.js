import express from "express";
import {
  addPordToCart,
  addShippingAddress,
  clearCart,
  createUser,
  deleteUser,
  getAllUsers,
  getProfile,
  getUpdateUserById,
  getUserById,
  LoggIn,
  loggOut,
  removeProdToCart,
  updateProfile,
} from "../controllers/UsersController.js";
import { authenticate, authorized } from "../middlewares/AuthMiddleware.js";
const router = express.Router();

router.post("/loggin", LoggIn);

router.post("/loggout", loggOut);

router.get("/profile", getProfile);

router.put("/profile", updateProfile);

router.post("/create-user", createUser);

router.post("/add-tocart/:prodId", addPordToCart);

router.post("/remove-fromCart/:prodId", removeProdToCart);

router.post("/add-shippingAddress", addShippingAddress);

router.post("/clear-cart", clearCart);

// Admin Routes 👇👇👇👇

router.use(authorized);

router.get("/get-all-users", getAllUsers);

router.get("/get-user/:id", getUserById);

router.put("/update-user/:id", getUpdateUserById);

router.delete("/delete-user/:id", deleteUser);

export default router;
