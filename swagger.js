import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Personal Finance Tracker API",
      version: "1.0.0",
      description:
        "API for managing personal finances, including users, categories, budgets and transactions.",
    },

    servers: [
      {
        url: "https://personal-finance-tracker-api-k3ya.onrender.com",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          required: ["email", "password", "name"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string", minLength: 6 },
            name: { type: "string" },
          },
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
            notes: { type: "string" },
          },
        },

        Category: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            color: { type: "string" },
          },
        },

        Budget: {
          type: "object",
          properties: {
            categoryId: { type: "string" },
            amount: { type: "number" },
            month: { type: "number" },
            year: { type: "number" },
          },
        },

        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ["./routes/*.js"],
};

const specs = swaggerJSDoc(options);

/* ---------------------------------------------
   MANUAL PATHS
---------------------------------------------- */

specs.paths = {
  /* ---------- AUTH ---------- */
  "/api/v1/auth/register": {
    post: {
      summary: "Register a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/User" },
          },
        },
      },
      responses: {
        201: { description: "User registered successfully" },
        400: { description: "Validation error" },
        500: { description: "Server error" },
      },
    },
  },

  "/api/v1/auth/login": {
    post: {
      summary: "Authenticate user & return JWT token",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email" },
                password: { type: "string" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Login success, returns token" },
        401: { description: "Invalid credentials" },
      },
    },
  },

  /* ---------- USERS ---------- */
  "/api/v1/users": {
    get: {
      summary: "Get all users",
      responses: {
        200: { description: "List of users" },
      },
    },

    post: {
      summary: "Create a new user",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/User" },
          },
        },
      },
      responses: {
        201: { description: "User created" },
      },
    },
  },

  "/api/v1/users/{id}": {
    get: {
      summary: "Get user by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "User data" } },
    },

    put: {
      summary: "Update user by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/User" },
          },
        },
      },
      responses: { 200: { description: "User updated" } },
    },

    delete: {
      summary: "Delete user by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "User deleted" } },
    },
  },

  /* ---------- TRANSACTIONS ---------- */
  "/api/v1/transactions": {
    get: {
      summary: "Get all user transactions",
      responses: {
        200: { description: "List of transactions" },
      },
    },

    post: {
      summary: "Create a new transaction",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Transaction" },
          },
        },
      },
      responses: { 201: { description: "Transaction created" } },
    },
  },

  "/api/v1/transactions/{id}": {
    get: {
      summary: "Get transaction by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Transaction data" } },
    },

    put: {
      summary: "Update transaction",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Transaction" },
          },
        },
      },
      responses: { 200: { description: "Transaction updated" } },
    },

    delete: {
      summary: "Delete transaction",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Transaction deleted" } },
    },
  },

  /* ---------- CATEGORIES ---------- */
  "/api/v1/categories": {
    get: {
      summary: "Get all categories",
      responses: { 200: { description: "List of categories" } },
    },

    post: {
      summary: "Create a new category",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Category" },
          },
        },
      },
      responses: { 201: { description: "Category created" } },
    },
  },

  "/api/v1/categories/{id}": {
    get: {
      summary: "Get category by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Category data" } },
    },

    put: {
      summary: "Update category",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Category" },
          },
        },
      },
      responses: { 200: { description: "Category updated" } },
    },

    delete: {
      summary: "Delete category",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Category deleted" } },
    },
  },

  /* ---------- BUDGETS ---------- */
  "/api/v1/budgets": {
    get: {
      summary: "Get all budgets",
      responses: { 200: { description: "List of budgets" } },
    },

    post: {
      summary: "Create a new budget",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Budget" },
          },
        },
      },
      responses: { 201: { description: "Budget created" } },
    },
  },

  "/api/v1/budgets/{id}": {
    get: {
      summary: "Get budget by ID",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Budget data" } },
    },

    put: {
      summary: "Update budget",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/Budget" },
          },
        },
      },
      responses: { 200: { description: "Budget updated" } },
    },

    delete: {
      summary: "Delete budget",
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "string" } },
      ],
      responses: { 200: { description: "Budget deleted" } },
    },
  },
};

/* ---------------------------------------------
   EXPORT (IMPORTANT for ES MODULES)
---------------------------------------------- */
export default specs;
