// models/Transaction.js

// Nom de la collection MongoDB
export const TRANSACTION_COLLECTION = 'transactions';

// Structure de référence (pour documentation / validation dans controllers)
export const transactionStructure = {
  userId: 'ObjectId',        // Référence à la collection users
  amount: 'number',
  description: 'string',
  categoryId: 'ObjectId',    // Référence optionnelle
  date: 'date',
  type: 'string',            // 'income' ou 'expense'
  tags: 'array',             // Tableau de chaînes
  notes: 'string',
  createdAt: 'date',
  updatedAt: 'date'
};
