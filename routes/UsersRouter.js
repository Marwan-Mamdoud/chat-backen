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

router.get("/profile", authenticate, getProfile);

router.put("/profile", authenticate, updateProfile);

router.post("/create-user", createUser);

router.post("/add-tocart/:prodId", authenticate, addPordToCart);

router.post("/remove-fromCart/:prodId", authenticate, removeProdToCart);

router.post("/add-shippingAddress", authenticate, addShippingAddress);

router.post("/clear-cart", authenticate, clearCart);

// Admin Routes 👇👇👇👇

router.use(authorized);

router.get("/get-all-users", getAllUsers);

router.get("/get-user/:id", getUserById);

router.put("/update-user/:id", getUpdateUserById);

router.delete("/delete-user/:id", deleteUser);

export default router;
