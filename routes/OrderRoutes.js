import { Router } from "express";
import {
  calculateSalesByDate,
  createOrder,
  getAllOrders,
  getOrderById,
  getUserOrders,
  markOrderAsDeliverd,
  markOrderAsPaid,
} from "../controllers/OrdersController.js";
import { authenticate, authorized } from "../middlewares/AuthMiddleware.js";
const router = Router();

router.use(authenticate);

router.post("/create-order", createOrder);

router.get("/getMy-orders", getUserOrders);

router.put("/markOrderAdDeliverd/:id", markOrderAsDeliverd);

router.get("/get-order/:id", getOrderById);

router.put("/markOrderAsPaid/:id", markOrderAsPaid);

// Admin Routes 👇👇👇👇👇

router.use(authorized);

router.get("/getAll-orders", getAllOrders);

router.get("/get-order/:id", getOrderById);

router.put("/markOrderAsPaid/:id", markOrderAsPaid);

// router.get("/get-sales-date", calculateSalesByDate);

export default router;
