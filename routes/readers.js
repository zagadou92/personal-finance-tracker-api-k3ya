import { Router } from "express";
import { getDb } from "../data/database.js";
import { ObjectId } from "mongodb";

export const readersRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Readers
 *   description: Gestion des lecteurs
 */

/**
 * @swagger
 * /readers:
 *   get:
 *     summary: Récupère tous les lecteurs
 *     tags: [Readers]
 *     security:
 *       - OAuth2: []
 *     responses:
 *       200:
 *         description: Liste des lecteurs
 *   post:
 *     summary: Crée un nouveau lecteur
 *     tags: [Readers]
 *     security:
 *       - OAuth2: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lecteur créé
 */

/**
 * @swagger
 * /readers/{id}:
 *   get:
 *     summary: Récupère un lecteur par ID
 *     tags: [Readers]
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
 *         description: Lecteur trouvé
 *       404:
 *         description: Lecteur non trouvé
 *   put:
 *     summary: Met à jour un lecteur par ID
 *     tags: [Readers]
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
 *         description: Lecteur mis à jour
 *       404:
 *         description: Lecteur non trouvé
 *   delete:
 *     summary: Supprime un lecteur par ID
 *     tags: [Readers]
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
 *         description: Lecteur supprimé
 *       404:
 *         description: Lecteur non trouvé
 */

const getCollection = () => getDb().collection("readers");

// Routes CRUD
readersRouter.get("/", async (req, res) => {
  const readers = await getCollection().find().toArray();
  res.json(readers);
});

readersRouter.get("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const reader = await getCollection().findOne({ _id: id });
  if (!reader) return res.status(404).json({ message: "Lecteur non trouvé" });
  res.json(reader);
});

readersRouter.post("/", async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "name et email requis" });

  const result = await getCollection().insertOne(req.body);
  res.status(201).json({ message: "Lecteur créé", id: result.insertedId });
});

readersRouter.put("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const updateData = req.body;

  const result = await getCollection().updateOne({ _id: id }, { $set: updateData });
  if (result.matchedCount === 0) return res.status(404).json({ message: "Lecteur non trouvé" });

  res.json({ message: "Lecteur mis à jour" });
});

readersRouter.delete("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await getCollection().deleteOne({ _id: id });
  if (result.deletedCount === 0) return res.status(404).json({ message: "Lecteur non trouvé" });

  res.json({ message: "Lecteur supprimé" });
});
