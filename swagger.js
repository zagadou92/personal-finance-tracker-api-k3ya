// swagger.js
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Finance Tracker API",
      version: "1.0.0",
      description: "API for managing personal finances, including users, categories, budgets, and transactions."
    },
    servers: [
      { url: "https://personal-finance-tracker-api-k3ya.onrender.com" } // Remplace par ton URL Render
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        User: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            name: { type: "string" }
          }
        },
        Transaction: {
          type: "object",
          required: ["amount", "description", "date", "type"],
          properties: {
            amount: { type: "number" },
            description: { type: "string" },
            categoryId: { type: "string" },
            date: { type: "string", format: "date-time" },
            type: { type: "string", enum: ["income", "expense"] },
            tags: { type: "array", items: { type: "string" } },
            notes: { type: "string" }
          }
        },
        Category: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            color: { type: "string" }
          }
        },
        Budget: {
          type: "object",
          properties: {
            categoryId: { type: "string" },
            amount: { type: "number" },
            month: { type: "number" },
            year: { type: "number" }
          }
        },
        Error: {
          type: "object",
          properties: { error: { type: "string" } }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./routes/*.js"] // Analyse des routes si tu ajoutes des commentaires Swagger
};

// Génère le swaggerSpec
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
