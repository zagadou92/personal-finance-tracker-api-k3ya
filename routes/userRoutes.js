// routes/userRoutes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Routes utilisateurs avec authentification
router.route('/')
  .get(auth, getAllUsers)   // Récupérer tous les utilisateurs
  .post(createUser);        // Créer un nouvel utilisateur (pas besoin d'auth pour l'inscription)

router.route('/:id')
  .get(auth, getUserById)   // Récupérer un utilisateur par ID
  .put(auth, updateUser)    // Mettre à jour un utilisateur
  .delete(auth, deleteUser);// Supprimer un utilisateur

export default router;
