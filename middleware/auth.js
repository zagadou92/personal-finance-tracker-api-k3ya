// middleware/auth.js
import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  try {
    // Récupère le token dans l'en-tête Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Accès refusé : token manquant' });
    }

    // Vérifie et décode le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute les informations de l'utilisateur à la requête

    next();
  } catch (error) {
    console.error('Erreur d’authentification JWT:', error);
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}
