// models/User.js

// Nom de la collection MongoDB
export const USER_COLLECTION = 'users';

// Structure de référence (pour documentation / validation dans controllers)
export const userStructure = {
  email: 'string',    // Unique
  password: 'string', // Hashé
  name: 'string'
};
