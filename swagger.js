const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Personal Finance Tracker API',
      version: '1.0.0',
      description: 'API for managing personal finances, including users and transactions.'
    },
    servers: [{ url: 'https://personal-finance-tracker-api-k3ya.onrender.com' }],  // Replace with your actual Render URL
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: { type: 'string', format: 'email', description: 'User email' },
            password: { type: 'string', minLength: 6, description: 'User password (hashed)' },
            name: { type: 'string', description: 'User name' }
          }
        },
        Transaction: {
          type: 'object',
          required: ['amount', 'description', 'date', 'type'],
          properties: {
            amount: { type: 'number', description: 'Transaction amount (positive for income, negative for expense)' },
            description: { type: 'string', description: 'Transaction description' },
            categoryId: { type: 'string', description: 'Optional category ObjectId' },
            date: { type: 'string', format: 'date-time', description: 'Transaction date' },
            type: { type: 'string', enum: ['income', 'expense'], description: 'Transaction type' },
            tags: { type: 'array', items: { type: 'string' }, description: 'Optional tags' },
            notes: { type: 'string', description: 'Optional notes' }
          }
        },
        Category: {
  type: 'object',
  properties: { name: { type: 'string' }, description: { type: 'string' }, color: { type: 'string' } }
},
Budget: {
  type: 'object',
  properties: { categoryId: { type: 'string' }, amount: { type: 'number' }, month: { type: 'number' }, year: { type: 'number' } }
},
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', description: 'Error message' }
          }
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js']  // Points to your route files for additional annotations if needed
};

const specs = swaggerJSDoc(options);

// Manually add paths (since apis array may not auto-detect without @swagger comments)
specs.paths = {
  '/api/v1/auth/register': {
    post: {
      summary: 'Register a new user',
      description: 'Creates a new user account.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' }
          }
        }
      },
      responses: {
        201: { description: 'User registered successfully' },
        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/v1/auth/login': {
    post: {
      summary: 'Login user',
      description: 'Authenticates a user and returns a JWT token.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', format: 'email' },
                password: { type: 'string' }
              }
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { token: { type: 'string' } }
              }
            }
          }
        },
        401: { description: 'Invalid credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/v1/users': {
    get: {
      summary: 'Get all users',
      description: 'Retrieves a list of all users.',
      responses: {
        200: {
          description: 'List of users',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/User' }
              }
            }
          }
        },
        401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    post: {
      summary: 'Create a new user',
      description: 'Creates a new user.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' }
          }
        }
      },
      responses: {
        201: {
          description: 'User created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/v1/users/{id}': {
    get: {
      summary: 'Get user by ID',
      description: 'Retrieves a single user by ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID'
        }
      ],
      responses: {
        200: {
          description: 'User data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/User' }
            }
          }
        },
        404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    put: {
      summary: 'Update user by ID',
      description: 'Updates a user by ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/User' }
          }
        }
      },
      responses: {
        200: { description: 'User updated' },
        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    delete: {
      summary: 'Delete user by ID',
      description: 'Deletes a user by ID.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'User ID'
        }
      ],
      responses: {
        200: { description: 'User deleted' },
        404: { description: 'User not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/v1/transactions': {
    get: {
      summary: 'Get all transactions for user',
      description: 'Retrieves all transactions for the authenticated user.',
      responses: {
        200: {
          description: 'List of transactions',
          content: {
            'application/json': {
              schema: {
                type: 'array',
                items: { $ref: '#/components/schemas/Transaction' }
              }
            }
          }
        },
        401: { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    post: {
      summary: 'Create a new transaction',
      description: 'Creates a new transaction for the authenticated user.',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Transaction' }
          }
        }
      },
      responses: {
        201: {
          description: 'Transaction created',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Transaction' }
            }
          }
        },
        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
  '/api/v1/transactions/{id}': {
    get: {
      summary: 'Get transaction by ID',
      description: 'Retrieves a single transaction by ID for the authenticated user.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Transaction ID'
        }
      ],
      responses: {
        200: {
          description: 'Transaction data',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Transaction' }
            }
          }
        },
        404: { description: 'Transaction not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    put: {
      summary: 'Update transaction by ID',
      description: 'Updates a transaction by ID for the authenticated user.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Transaction ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Transaction' }
          }
        }
      },
      responses: {
        200: { description: 'Transaction updated' },
        400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        404: { description: 'Transaction not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    },
    delete: {
      summary: 'Delete transaction by ID',
      description: 'Deletes a transaction by ID for the authenticated user.',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' },
          description: 'Transaction ID'
        }
      ],
      responses: {
        200: { description: 'Transaction deleted' },
        404: { description: 'Transaction not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        500: { description: 'Server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
      }
    }
  },
'/api/v1/categories': {
  get: { summary: 'Get all categories', security: [{ bearerAuth: [] }], responses: { 200: { description: 'List of categories' } } },
  post: { summary: 'Create category', security: [{ bearerAuth: [] }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } }, responses: { 201: { description: 'Category created' } } }
},
'/api/v1/categories/{id}': {
  get: { summary: 'Get category by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Category data' } } },
  put: { summary: 'Update category', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Category' } } } }, responses: { 200: { description: 'Category updated' } } },
  delete: { summary: 'Delete category', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Category deleted' } } }
},
// Budgets (similar structure)
'/api/v1/budgets': {
  get: { summary: 'Get all budgets', security: [{ bearerAuth: [] }], responses: { 200: { description: 'List of budgets' } } },
  post: { summary: 'Create budget', security: [{ bearerAuth: [] }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Budget' } } } }, responses: { 201: { description: 'Budget created' } } }
},
'/api/v1/budgets/{id}': {
  get: { summary: 'Get budget by ID', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Budget data' } } },
  put: { summary: 'Update budget', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Budget' } } }, responses: { 200: { description: 'Budget updated' } } },
  delete: { summary: 'Delete budget', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Budget deleted' } } }
  }
  }
};

module.exports = specs;
