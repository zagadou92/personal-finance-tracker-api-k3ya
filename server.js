import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";

// DB
import { dbInit, COLLECTIONS } from "./db.js";

const app = express();
const PORT = process.env.PORT || 5500;

// --------------------
// Middleware
// --------------------
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --------------------
// Middleware Auth
// --------------------
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ error: "Utilisateur non authentifié" });
}

// --------------------
// Fonction principale async
// --------------------
async function startServer() {
  let db;
  try {
    db = await dbInit();
    console.log("✅ MongoDB initialized");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }

  // Middleware pour accéder à db et collections
  app.use((req, res, next) => {
    req.db = db;
    req.collections = COLLECTIONS;
    next();
  });

  // --------------------
  // Passport Serialize / Deserialize
  // --------------------
  passport.serializeUser((user, done) => done(null, user.email));
  passport.deserializeUser(async (email, done) => {
    try {
      const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });

  // --------------------
  // Google OAuth Strategy
  // --------------------
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          let user = await db.collection(COLLECTIONS.USERS).findOne({ email });

          if (!user) {
            user = {
              id: profile.id,
              name: profile.displayName,
              email,
              provider: "google",
              photo: profile.photos?.[0]?.value,
            };
            await db.collection(COLLECTIONS.USERS).insertOne(user);
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  // --------------------
  // GitHub OAuth Strategy
  // --------------------
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          let user = await db.collection(COLLECTIONS.USERS).findOne({ email });

          if (!user) {
            user = {
              id: profile.id,
              name: profile.displayName || profile.username,
              email,
              provider: "github",
              photo: profile.photos?.[0]?.value,
            };
            await db.collection(COLLECTIONS.USERS).insertOne(user);
          }
          done(null, user);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );

  // --------------------
  // OAuth Routes
  // --------------------
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login-failure" }),
    (req, res) => res.json({ message: "Connexion Google réussie", user: req.user })
  );

  app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
  app.get(
    "/auth/github/callback",
    passport.authenticate("github", { failureRedirect: "/login-failure" }),
    (req, res) => res.json({ message: "Connexion GitHub réussie", user: req.user })
  );

  app.get("/logout", (req, res, next) => {
    req.logout(err => {
      if (err) return next(err);
      res.json({ message: "Déconnexion réussie" });
    });
  });

  app.get("/login-failure", (req, res) => res.status(401).json({ error: "Échec de l'authentification OAuth" }));

  // --------------------
  // Routes API protégées
  // --------------------
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", ensureAuth, userRoutes);
  app.use("/api/v1/accounts", ensureAuth, accountRoutes);
  app.use("/api/v1/transactions", ensureAuth, transactionRoutes);
  app.use("/api/v1/categories", ensureAuth, categoryRoutes);
  app.use("/api/v1/budgets", ensureAuth, budgetRoutes);

  // Profile
  app.get("/profile", ensureAuth, (req, res) => res.json({ user: req.user }));

  // Swagger Docs
  app.use("/api-docs", ensureAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // --------------------
  // Start Server
  // --------------------
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
}

// Lancer le serveur
startServer();
