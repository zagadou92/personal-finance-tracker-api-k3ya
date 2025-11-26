import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-out.json" assert { type: "json" };

export const swaggerRouter = Router();

// Options supplémentaires pour Swagger UI
const swaggerOptions = {
  customSiteTitle: "📘 CSE341 Contacts API Documentation",
  explorer: true, // Permet la recherche dans la doc
};

// --- Middleware : rendre swagger-ui accessible sur /api-docs ---
swaggerRouter.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// --- Route racine du swagger router ---
swaggerRouter.get("/", (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align:center; margin-top: 50px;">
      <h1>🚀 CSE341 Contacts API</h1>
      <p>La documentation Swagger est disponible ici :</p>
      <a href="/swagger/api-docs" style="font-size:18px;">/api-docs</a>
      <p>⚠️ Assurez-vous que vos routes contiennent bien les annotations Swagger.</p>
    </div>
  `);
});
