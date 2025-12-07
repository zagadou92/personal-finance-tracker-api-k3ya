import Joi from "joi";
import { ObjectId } from "mongodb";
import { TRANSACTION_COLLECTION } from "../models/Transaction.js";

// Schéma de validation pour création
const transactionSchema = Joi.object({
  amount: Joi.number().positive().required(),
  description: Joi.string().required(),
  categoryId: Joi.string().optional(),
  date: Joi.date().required(),
  type: Joi.string().valid("income", "expense").required(),
  tags: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional()
});

// Schéma de validation pour mise à jour (au moins un champ requis)
const transactionUpdateSchema = Joi.object({
  amount: Joi.number().positive().optional(),
  description: Joi.string().optional(),
  categoryId: Joi.string().optional(),
  date: Joi.date().optional(),
  type: Joi.string().valid("income", "expense").optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  notes: Joi.string().optional()
}).min(1);

// Helper pour gérer ObjectId
const toObjectId = (id) => ObjectId.isValid(id) ? new ObjectId(id) : null;

// Récupérer toutes les transactions d’un utilisateur
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await req.db.collection(TRANSACTION_COLLECTION)
      .find({ userId: new ObjectId(req.user.id) })
      .toArray();
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Récupérer une transaction par ID
export const getTransactionById = async (req, res) => {
  const transactionId = toObjectId(req.params.id);
  if (!transactionId) return res.status(400).json({ error: "Invalid ID" });

  try {
    const transaction = await req.db.collection(TRANSACTION_COLLECTION)
      .findOne({ _id: transactionId, userId: new ObjectId(req.user.id) });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Créer une nouvelle transaction
export const createTransaction = async (req, res) => {
  const { error } = transactionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const transaction = {
      ...req.body,
      userId: new ObjectId(req.user.id),
      categoryId: req.body.categoryId ? new ObjectId(req.body.categoryId) : undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await req.db.collection(TRANSACTION_COLLECTION).insertOne(transaction);
    res.status(201).json({ _id: result.insertedId, ...transaction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Mettre à jour une transaction
export const updateTransaction = async (req, res) => {
  const { error } = transactionUpdateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const transactionId = toObjectId(req.params.id);
  if (!transactionId) return res.status(400).json({ error: "Invalid ID" });

  try {
    const updateData = {
      ...req.body,
      categoryId: req.body.categoryId ? new ObjectId(req.body.categoryId) : undefined,
      updatedAt: new Date()
    };
    const result = await req.db.collection(TRANSACTION_COLLECTION)
      .updateOne({ _id: transactionId, userId: new ObjectId(req.user.id) }, { $set: updateData });

    if (result.matchedCount === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Supprimer une transaction
export const deleteTransaction = async (req, res) => {
  const transactionId = toObjectId(req.params.id);
  if (!transactionId) return res.status(400).json({ error: "Invalid ID" });

  try {
    const result = await req.db.collection(TRANSACTION_COLLECTION)
      .deleteOne({ _id: transactionId, userId: new ObjectId(req.user.id) });

    if (result.deletedCount === 0) return res.status(404).json({ error: "Transaction not found" });
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
