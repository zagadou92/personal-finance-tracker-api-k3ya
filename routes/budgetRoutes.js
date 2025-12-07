// routes/budgetRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget
} from "../controllers/budgetController.js";

const router = express.Router();

/**
 * Routes pour la gestion des budgets
 * Toutes les routes nécessitent une authentification via le middleware `auth`
 */

// Route pour récupérer tous les budgets et créer un nouveau budget
router.route("/")
  .get(auth, getAllBudgets)        // GET /api/v1/budgets
  .post(auth, createBudget);       // POST /api/v1/budgets

// Routes pour manipuler un budget spécifique par son ID
router.route("/:id")
  .get(auth, getBudgetById)        // GET /api/v1/budgets/:id
  .put(auth, updateBudget)         // PUT /api/v1/budgets/:id
  .delete(auth, deleteBudget);     // DELETE /api/v1/budgets/:id

export default router;
