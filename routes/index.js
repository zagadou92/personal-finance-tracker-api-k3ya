import { Router } from "express";
import { booksRouter } from "./books.js";
import { readersRouter } from "./readers.js";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../swagger.js";

export const router = Router();

// Swagger
router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes API
router.use("/books", booksRouter);
router.use("/readers", readersRouter);

// Route test
router.get("/", (req, res) => {
  res.send("Hello Readers & Books API!");
});
