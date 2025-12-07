// routes/transactionRoutes.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

// Routes pour les transactions avec authentification
router.route("/")
  .get(auth, getAllTransactions)     // Récupérer toutes les transactions
  .post(auth, createTransaction);    // Créer une nouvelle transaction

router.route("/:id")
  .get(auth, getTransactionById)     // Récupérer une transaction par ID
  .put(auth, updateTransaction)      // Mettre à jour une transaction
  .delete(auth, deleteTransaction);  // Supprimer une transaction

export default router;
