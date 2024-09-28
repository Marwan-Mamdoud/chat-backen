import { Router } from "express";
import {
  createCategories,
  deleteCategory,
  getAllCategories,
  updataCategory,
} from "../controllers/CategoriesController.js";
import { authenticate, authorized } from "../middlewares/AuthMiddleware.js";
const router = Router();

// router.use(authenticate);

router.get("/getAll-categories", getAllCategories);

router.use(authorized);

router.post("/create-category", createCategories);

router.delete("/delete-category/:id", deleteCategory);

router.put("/update-category/:id", updataCategory);

export default router;
