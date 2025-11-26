import "dotenv/config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Options pour swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CSE341 Contacts API",
      version: "1.0.0",
      description: "Documentation complète de l'API CSE341 Contacts",
    },
    servers: [
      {
        url: "http://localhost:5500", // Serveur local
      },
      {
        url: "https://cse341contactsw1.onrender.com", // Serveur de production
      },
    ],
    components: {
      securitySchemes: {
        apiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "apiKey",
          description: "Enter your API key here",
        },
      },
      schemas: {
        Book: {
          type: "object",
          required: ["isbn", "title", "author"],
          properties: {
            id: { type: "string", example: "1" },
            isbn: { type: "string", example: "9783161484100" },
            title: { type: "string", example: "Le Petit Prince" },
            author: { type: "string", example: "Antoine de Saint-Exupéry" },
            publisher: { type: "string", example: "Éditions Gallimard" },
            year: { type: "integer", example: 1943 },
            edition: { type: "string", example: "1ère édition" },
            format: { type: "string", example: "Broché" },
            language: { type: "string", example: "French" },
            genres: { type: "array", items: { type: "string" }, example: ["Fiction", "Children"] },
          },
        },
        Reader: {
          type: "object",
          required: ["firstname", "lastname", "email"],
          properties: {
            id: { type: "string", example: "1" },
            firstname: { type: "string", example: "John" },
            lastname: { type: "string", example: "Doe" },
            email: { type: "string", example: "john.doe@gmail.com" },
            books: { type: "array", items: { type: "string" }, example: ["9783161484100", "9782070368224"] },
          },
        },
      },
    },
    security: [{ apiKeyAuth: [] }], // Appliquer la sécurité API Key globalement
  },
  apis: [
    "./routes/index.js",
    "./routes/books.js",
    "./routes/readers.js",
  ],
};

// Génération du swaggerSpec
export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
