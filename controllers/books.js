import { dbInit, getDb } from "../data/database.js";
import { ObjectId } from "mongodb";

await dbInit();
const db = getDb();
const books = db.collection("books");

export const booksController = {

  // -------------------------------------------------------
  // GET ALL BOOKS
  // -------------------------------------------------------
  getAll: async (req, res) => {
    try {
      const result = await books.find().toArray();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error });
    }
  },

  // -------------------------------------------------------
  // GET ONE BOOK BY ID
  // -------------------------------------------------------
  getSingle: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const book = await books.findOne({ _id: id });

      if (!book) return res.status(404).json({ message: "Book not found" });

      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: "Invalid ID", error });
    }
  },

  // -------------------------------------------------------
  // GET BOOK BY ISBN
  // -------------------------------------------------------
  getByIsbn: async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const book = await books.findOne({ isbn });

      if (!book) return res.status(404).json({ message: "Book not found" });

      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ message: "Error fetching book", error });
    }
  },

  // -------------------------------------------------------
  // CREATE A BOOK (avec validation)
  // -------------------------------------------------------
  createBook: async (req, res) => {
    try {
      const { isbn, title, author, publisher, year, edition, format } = req.body;

      // Validation simple
      if (!isbn || !title || !author) {
        return res.status(400).json({ message: "ISBN, title, and author are required." });
      }
      if (year && (typeof year !== "number" || year <= 0)) {
        return res.status(400).json({ message: "Year must be a positive number." });
      }

      const book = { isbn, title, author, publisher, year, edition, format };
      const response = await books.insertOne(book);

      res.status(201).json({ message: "Book created successfully", id: response.insertedId, book });

    } catch (error) {
      res.status(500).json({ message: "Error inserting book", error });
    }
  },

  // -------------------------------------------------------
  // UPDATE A BOOK (avec validation)
  // -------------------------------------------------------
  updateBook: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const { isbn, title, author, publisher, year, edition, format } = req.body;

      // Vérifier qu'au moins un champ est présent pour la mise à jour
      if (!isbn && !title && !author && !publisher && !year && !edition && !format) {
        return res.status(400).json({ message: "At least one field must be provided for update." });
      }
      if (year && (typeof year !== "number" || year <= 0)) {
        return res.status(400).json({ message: "Year must be a positive number." });
      }

      const updatedBook = { isbn, title, author, publisher, year, edition, format };
      const response = await books.updateOne({ _id: id }, { $set: updatedBook });

      if (response.matchedCount === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book updated successfully" });

    } catch (error) {
      res.status(500).json({ message: "Error updating book", error });
    }
  },

  // -------------------------------------------------------
  // DELETE A BOOK
  // -------------------------------------------------------
  deleteBook: async (req, res) => {
    try {
      const id = new ObjectId(req.params.id);
      const response = await books.deleteOne({ _id: id });

      if (response.deletedCount === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
      res.status(500).json({ message: "Error deleting book", error });
    }
  },
};
