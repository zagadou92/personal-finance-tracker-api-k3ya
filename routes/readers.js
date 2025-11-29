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
 * components:
 *   schemas:
 *     Reader:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         books:
 *           type: array
 *           items:
 *             type: string
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reader'
 *
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
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reader'
 *       404:
 *         description: Lecteur non trouvé
 *
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
 *             $ref: '#/components/schemas/Reader'
 *     responses:
 *       200:
 *         description: Lecteur mis à jour
 *       404:
 *         description: Lecteur non trouvé
 *
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

// GET all readers
readersRouter.get("/", async (req, res) => {
  const readers = await getCollection().find().toArray();
  res.json(readers);
});

// GET one reader by ID
readersRouter.get("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const reader = await getCollection().findOne({ _id: id });
  if (!reader) return res.status(404).json({ message: "Lecteur non trouvé" });
  res.json(reader);
});

// POST – create reader with fields
readersRouter.post("/", async (req, res) => {
  const { firstname, lastname, email } = req.body;

  if (!firstname || !lastname || !email) {
    return res.status(400).json({
      message: "firstname, lastname et email sont requis",
    });
  }

  const newReader = {
    firstname,
    lastname,
    email,
    books: [], // ajouté automatiquement
  };

  const result = await getCollection().insertOne(newReader);

  res.status(201).json({
    message: "Lecteur créé",
    id: result.insertedId,
  });
});

// PUT – update reader
readersRouter.put("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await getCollection().updateOne(
    { _id: id },
    { $set: req.body }
  );

  if (result.matchedCount === 0) {
    return res.status(404).json({ message: "Lecteur non trouvé" });
  }

  res.json({ message: "Lecteur mis à jour" });
});

// DELETE – delete reader
readersRouter.delete("/:id", async (req, res) => {
  const id = new ObjectId(req.params.id);
  const result = await getCollection().deleteOne({ _id: id });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: "Lecteur non trouvé" });
  }

  res.json({ message: "Lecteur supprimé" });
});
