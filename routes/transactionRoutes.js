import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// GET all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await req.db.collection(req.collections.TRANSACTIONS).find({}).toArray();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET transaction by ID
router.get("/:id", async (req, res) => {
  try {
    const transaction = await req.db
      .collection(req.collections.TRANSACTIONS)
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!transaction) return res.status(404).json({ error: "Transaction not found" });
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new transaction
router.post("/", async (req, res) => {
  try {
    const { amount, accountId, categoryId, date } = req.body;
    if (!amount || !accountId || !categoryId || !date)
      return res.status(400).json({ error: "Missing fields" });
    const result = await req.db.collection(req.collections.TRANSACTIONS).insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update transaction
router.put("/:id", async (req, res) => {
  try {
    const result = await req.db
      .collection(req.collections.TRANSACTIONS)
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE transaction
router.delete("/:id", async (req, res) => {
  try {
    const result = await req.db
      .collection(req.collections.TRANSACTIONS)
      .deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
