// models/Budget.js
import { ObjectId } from "mongodb";

// Nom de la collection MongoDB
export const BUDGET_COLLECTION = "budgets";

// Structure d’un document budget pour référence
export const budgetStructure = {
  userId: ObjectId,       // Référence à l’utilisateur
  categoryId: ObjectId,   // Référence à la catégorie
  amount: Number,         // Montant du budget
  month: Number,          // Mois (1 à 12)
  year: Number,           // Année
  createdAt: Date         // Date de création
};
