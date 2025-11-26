import { check } from "express-validator";

export const readerValidator = () => {
  return [
    check("username")
      .exists({ checkFalsy: true })
      .isString()
      .trim()
      .withMessage("Le nom d'utilisateur est requis et doit être une chaîne de caractères."),

    check("books")
      .exists({ checkFalsy: true })
      .isArray()
      .withMessage("La liste des livres est requise et doit être un tableau.")
      .custom((list) => list.every((book) => typeof book === "string"))
      .withMessage("Chaque livre de la liste doit être une chaîne de caractères."),
  ];
};
