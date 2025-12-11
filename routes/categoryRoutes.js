import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await req.db.collection(req.collections.CATEGORIES).find({}).toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET category by ID
router.get("/:id", async (req, res) => {
  try {
    const category = await req.db
      .collection(req.collections.CATEGORIES)
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new category
router.post("/", async (req, res) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) return res.status(400).json({ error: "Missing fields" });
    const result = await req.db.collection(req.collections.CATEGORIES).insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update category
router.put("/:id", async (req, res) => {
  try {
    const result = await req.db
      .collection(req.collections.CATEGORIES)
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE category
router.delete("/:id", async (req, res) => {
  try {
    const result = await req.db
      .collection(req.collections.CATEGORIES)
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
