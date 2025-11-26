import { dbInit, getDb } from "../data/database.js";
import { ObjectId } from "mongodb";

await dbInit();
const db = getDb();
const readers = db.collection("readers");

export const readersController = {

  // -------------------------------------------------------
  // GET ALL READERS
  // -------------------------------------------------------
  getAll: async (req, res) => {
    try {
      const result = await readers.find().toArray();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching readers", error });
    }
  },

  // -------------------------------------------------------
  // GET ONE READER BY ID
  // -------------------------------------------------------
  getSingle: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const reader = await readers.findOne({ _id: id });
      if (!reader) return res.status(404).json({ message: "Reader not found" });
      res.status(200).json(reader);
    } catch (error) {
      res.status(500).json({ message: "Invalid ID", error });
    }
  },

  // -------------------------------------------------------
  // CREATE A READER
  // -------------------------------------------------------
  createReader: async (req, res) => {
    try {
      const { firstname, lastname, email } = req.body;

      // Validation simple
      if (!firstname || !lastname || !email) {
        return res.status(400).json({ message: "Firstname, lastname, and email are required." });
      }

      const reader = { firstname, lastname, email };
      const response = await readers.insertOne(reader);

      res.status(201).json({ message: "Reader created successfully", id: response.insertedId, reader });
    } catch (error) {
      res.status(500).json({ message: "Error inserting reader", error });
    }
  },

  // -------------------------------------------------------
  // UPDATE A READER
  // -------------------------------------------------------
  updateReader: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const { firstname, lastname, email } = req.body;

      // Vérifier qu'au moins un champ est fourni pour la mise à jour
      if (!firstname && !lastname && !email) {
        return res.status(400).json({ message: "At least one field must be provided for update." });
      }

      const updatedReader = { firstname, lastname, email };
      const response = await readers.updateOne({ _id: id }, { $set: updatedReader });

      if (response.matchedCount === 0) return res.status(404).json({ message: "Reader not found" });

      res.status(200).json({ message: "Reader updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating reader", error });
    }
  },

  // -------------------------------------------------------
  // DELETE A READER
  // -------------------------------------------------------
  deleteReader: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const response = await readers.deleteOne({ _id: id });

      if (response.deletedCount === 0) return res.status(404).json({ message: "Reader not found" });

      res.status(200).json({ message: "Reader deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting reader", error });
    }
  },
};
