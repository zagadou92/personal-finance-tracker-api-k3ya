import { Router } from "express";
import { getDb } from "../data/database.js";
import { ObjectId } from "mongodb";

const booksRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Gestion des livres
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     OAuth2:
 *       type: oauth2
 *       flows:
 *         authorizationCode:
 *           authorizationUrl: 'https://example.com/oauth/authorize'
 *           tokenUrl: 'https://example.com/oauth/token'
 *           scopes: {}
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *         isbn:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         publisher:
 *           type: string
 *         year:
 *           type: integer
 *         edition:
 *           type: string
 *         format:
 *           type: string
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *         language:
 *           type: string
 *       example:
 *         _id: "691f4f139a249773ae947853"
 *         isbn: "9783161484100"
 *         title: "Le Petit Prince"
 *         author: "Antoine de Saint-Exupéry"
 *         publisher: "Éditions Gallimard"
 *         year: 2000
 *         edition: "1ère édition"
 *         format: "Broché"
 *         genres: ["Fiction", "Children"]
 *         language: "French"
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 *       500:
 *         description: Erreur serveur
 *
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
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Livre créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *       400:
 *         description: Données manquantes ou invalides
 *       500:
 *         description: Erreur serveur
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 *
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
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Livre mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 *
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: ID invalide
 *       404:
 *         description: Livre non trouvé
 *       500:
 *         description: Erreur serveur
 */

// Utilitaire pour récupérer la collection
const getCollection = () => getDb().collection("books");

// Routes CRUD
booksRouter.get("/", async (req, res) => {
  try {
    const books = await getCollection().find().toArray();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

booksRouter.get("/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const book = await getCollection().findOne({ _id: id });
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.json(book);
  } catch {
    res.status(400).json({ message: "ID invalide" });
  }
});

booksRouter.post("/", async (req, res) => {
  try {
    const data = req.body;
    if (!data.title || !data.author) {
      return res.status(400).json({ message: "title et author requis" });
    }
    const result = await getCollection().insertOne(data);
    res.status(201).json({ message: "Livre créé", id: result.insertedId });
  } catch {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

booksRouter.put("/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const updateData = req.body;
    const result = await getCollection().updateOne(
      { _id: id },
      { $set: updateData }
    );
    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Livre non trouvé" });
    res.json({ message: "Livre mis à jour" });
  } catch {
    res.status(400).json({ message: "ID invalide" });
  }
});

booksRouter.delete("/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const result = await getCollection().deleteOne({ _id: id });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Livre non trouvé" });
    res.json({ message: "Livre supprimé" });
  } catch {
    res.status(400).json({ message: "ID invalide" });
  }
});

// Export correct pour ES Modules
export { booksRouter };
