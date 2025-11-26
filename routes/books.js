import { Router } from "express";
import { getDb } from "../data/database.js";
import { ObjectId } from "mongodb";

export const booksRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gestion des livres
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Récupère tous les livres
 *     tags: [Books]
 *     security:
 *       - OAuth2: []
 *     responses:
 *       200:
 *         description: Liste des livres
 *   post:
 *     summary: Crée un nouveau livre
 *     tags: [Books]
 *     security:
 *       - OAuth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Livre créé
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Récupère un livre par ID
 *     tags: [Books]
 *     security:
 *       - OAuth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre trouvé
 *       404:
 *         description: Livre non trouvé
 *   put:
 *     summary: Met à jour un livre par ID
 *     tags: [Books]
 *     security:
 *       - OAuth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Livre mis à jour
 *       404:
 *         description: Livre non trouvé
 *   delete:
 *     summary: Supprime un livre par ID
 *     tags: [Books]
 *     security:
 *       - OAuth2: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Livre supprimé
 *       404:
 *         description: Livre non trouvé
 */

// Récupérer DB à chaque requête pour éviter l’erreur “Database not initialized”
const getCollection = () => getDb().collection("books");

// Routes CRUD
booksRouter.get("/", async (req, res) => {
  const books = await getCollection().find().toArray();
  res.json(books);
});

booksRouter.get("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const book = await getCollection().findOne({ _id: id });
  if (!book) return res.status(404).json({ message: "Livre non trouvé" });
  res.json(book);
});

booksRouter.post("/", async (req, res) => {
  const { title, author } = req.body;
  if (!title || !author) return res.status(400).json({ message: "title et author requis" });

  const result = await getCollection().insertOne(req.body);
  res.status(201).json({ message: "Livre créé", id: result.insertedId });
});

booksRouter.put("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const updateData = req.body;

  const result = await getCollection().updateOne({ _id: id }, { $set: updateData });
  if (result.matchedCount === 0) return res.status(404).json({ message: "Livre non trouvé" });

  res.json({ message: "Livre mis à jour" });
});

booksRouter.delete("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await getCollection().deleteOne({ _id: id });
  if (result.deletedCount === 0) return res.status(404).json({ message: "Livre non trouvé" });

  res.json({ message: "Livre supprimé" });
});
