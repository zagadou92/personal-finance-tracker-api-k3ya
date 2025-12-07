// controllers/categoryController.js
import Joi from "joi";
import { ObjectId } from "mongodb";
import { CATEGORY_COLLECTION } from "../models/Category.js";

// Schéma de validation
const categorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  color: Joi.string().optional()
});

// Helper pour ObjectId
const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
};

// GET all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await req.db
      .collection(CATEGORY_COLLECTION)
      .find({ userId: toObjectId(req.user.id) })
      .toArray();
    res.json(categories);
  } catch (error) {
    console.error("getAllCategories error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET category by ID
export const getCategoryById = async (req, res) => {
  const categoryId = toObjectId(req.params.id);
  if (!categoryId) return res.status(400).json({ error: "Invalid category ID" });

  try {
    const category = await req.db
      .collection(CATEGORY_COLLECTION)
      .findOne({ _id: categoryId, userId: toObjectId(req.user.id) });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (error) {
    console.error("getCategoryById error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// CREATE category
export const createCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const category = {
      ...req.body,
      userId: toObjectId(req.user.id),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await req.db.collection(CATEGORY_COLLECTION).insertOne(category);
    res.status(201).json({ _id: result.insertedId, ...category });
  } catch (error) {
    console.error("createCategory error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// UPDATE category
export const updateCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const categoryId = toObjectId(req.params.id);
  if (!categoryId) return res.status(400).json({ error: "Invalid category ID" });

  try {
    const updateData = { ...req.body, updatedAt: new Date() };
    const result = await req.db.collection(CATEGORY_COLLECTION).updateOne(
      { _id: categoryId, userId: toObjectId(req.user.id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category updated" });
  } catch (error) {
    console.error("updateCategory error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE category
export const deleteCategory = async (req, res) => {
  const categoryId = toObjectId(req.params.id);
  if (!categoryId) return res.status(400).json({ error: "Invalid category ID" });

  try {
    const result = await req.db.collection(CATEGORY_COLLECTION).deleteOne({
      _id: categoryId,
      userId: toObjectId(req.user.id)
    });
    if (result.deletedCount === 0) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("deleteCategory error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
