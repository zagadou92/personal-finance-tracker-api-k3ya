// controllers/authController.js

// Fonction pour l'inscription
export async function register(req, res) {
  try {
    const { email, password } = req.body;
    // Ici tu peux ajouter la logique pour créer un utilisateur dans MongoDB
    res.status(201).json({ message: "Utilisateur enregistré avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Fonction pour la connexion
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    // Ici tu peux ajouter la logique pour vérifier l'utilisateur dans MongoDB
    res.status(200).json({ message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
