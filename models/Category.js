// models/Category.js

export const CATEGORY_COLLECTION = "categories";

export const categoryStructure = {
  userId: "ObjectId",       // Référence à l'utilisateur propriétaire
  name: "string",           // Nom de la catégorie
  description: "string",    // Description optionnelle
  color: "string",          // Couleur associée à la catégorie
  createdAt: "date",        // Date de création
  updatedAt: "date"         // Date de dernière mise à jour
};
