// routes/categoryRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

// Routes pour les catégories avec authentification
router
  .route("/")
  .get(auth, getAllCategories)
  .post(auth, createCategory);

router
  .route("/:id")
  .get(auth, getCategoryById)
  .put(auth, updateCategory)
  .delete(auth, deleteCategory);

export default router;
