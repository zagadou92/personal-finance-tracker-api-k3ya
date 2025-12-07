// controllers/budgetController.js
import Joi from "joi";
import { ObjectId } from "mongodb";
import { BUDGET_COLLECTION } from "../models/Budget.js";

// Schéma de validation pour les budgets
const budgetSchema = Joi.object({
  categoryId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  month: Joi.number().integer().min(1).max(12).required(),
  year: Joi.number().integer().min(2020).required(),
});

export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await req.db
      .collection(BUDGET_COLLECTION)
      .find({ userId: new ObjectId(req.user.id) })
      .toArray();
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching budgets" });
  }
};

export const getBudgetById = async (req, res) => {
  try {
    const budget = await req.db.collection(BUDGET_COLLECTION).findOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.id),
    });

    if (!budget) return res.status(404).json({ error: "Budget not found" });
    res.json(budget);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while fetching the budget" });
  }
};

export const createBudget = async (req, res) => {
  const { error, value } = budgetSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const budget = {
      ...value,
      userId: new ObjectId(req.user.id),
      categoryId: new ObjectId(value.categoryId),
      createdAt: new Date(),
    };

    const result = await req.db.collection(BUDGET_COLLECTION).insertOne(budget);
    res.status(201).json({ _id: result.insertedId, ...budget });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while creating the budget" });
  }
};

export const updateBudget = async (req, res) => {
  const { error, value } = budgetSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updateData = {
      ...value,
      categoryId: new ObjectId(value.categoryId),
    };

    const result = await req.db.collection(BUDGET_COLLECTION).updateOne(
      { _id: new ObjectId(req.params.id), userId: new ObjectId(req.user.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating the budget" });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const result = await req.db.collection(BUDGET_COLLECTION).deleteOne({
      _id: new ObjectId(req.params.id),
      userId: new ObjectId(req.user.id),
    });

    if (result.deletedCount === 0) return res.status(404).json({ error: "Budget not found" });
    res.json({ message: "Budget deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting the budget" });
  }
};
