import { Router } from "express";
import CheckId from "../middlewares/CheckId.js";
import { authenticate, authorized } from "../middlewares/AuthMiddleware.js";
import {
  addReview,
  createProduct,
  deleteProduct,
  fetchCustomProduct,
  filterProducts,
  getAllProducts,
  getAllReviews,
  getBestProducts,
  getNewestProducts,
  // getAllReviewsForUser,
  getProduct,
  updateProduct,
} from "../controllers/ProductsController.js";
import formidable from "express-formidable";
const router = Router();

router.use(authenticate);

// Reviews---------------------

router.post("/add-review/:id", addReview);

router.get("/getAll-reviews/:id", getAllReviews);

// Products....................

router.get("/getAll-products", getAllProducts);

router.get("/get-product/:id", getProduct);

router.get("/getBest-products", getBestProducts);

router.get("/getNewest-products", getNewestProducts);

router.get("/getCustom-products", authenticate, fetchCustomProduct);

router.post("/filter-products", filterProducts);

//==========================================================================

router.use(authenticate);

// Products....................

router.put("/update-product/:id", formidable(), updateProduct);

router.post("/create-product", formidable(), createProduct);

router.delete("/delete-product/:id", deleteProduct);

// router.get("/getAll-reviews-forOneUser", getAllReviewsForUser);

export default router;
