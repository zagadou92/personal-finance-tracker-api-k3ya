import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { dbInit } from "./data/database.js";
import { booksRouter } from "./routes/books.js";
import { readersRouter } from "./routes/readers.js";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

dotenv.config();
const app = express();
const port = process.env.PORT || 5500;

// --------------------
// Middlewares
// --------------------
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --------------------
// Passport Serialize / Deserialize
// --------------------
passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser(async (email, done) => {
  try {
    const db = await dbInit();
    const user = await db.collection("users").findOne({ email });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// --------------------
// Auth Middleware
// --------------------
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/auth/google"); // Redirection vers login OAuth
}

// --------------------
// GOOGLE STRATEGY
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
        const db = await dbInit();
        const usersCollection = db.collection("users");
        const email = profile.emails?.[0]?.value;

        let user = await usersCollection.findOne({ email });
        if (!user) {
          user = {
            id: profile.id,
            name: profile.displayName,
            email,
            photo: profile.photos?.[0]?.value,
            provider: "google",
          };
          await usersCollection.insertOne(user);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

// --------------------
// GITHUB STRATEGY
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
        const db = await dbInit();
        const usersCollection = db.collection("users");
        const email = profile.emails?.[0]?.value;

        let user = await usersCollection.findOne({ email });
        if (!user) {
          user = {
            id: profile.id,
            name: profile.displayName || profile.username,
            email,
            photo: profile.photos?.[0]?.value,
            provider: "github",
          };
          await usersCollection.insertOne(user);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
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
  (req, res) => res.redirect("/profile")
);

app.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login-failure" }),
  (req, res) => res.redirect("/profile")
);

// Logout
app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Login failure
app.get("/login-failure", (req, res) => res.status(401).send("❌ Échec de l'authentification OAuth"));

// --------------------
// Protected API Routes
// --------------------
app.use("/books", ensureAuth, booksRouter);
app.use("/readers", ensureAuth, readersRouter);

// Profile routes
app.get("/profile", ensureAuth, (req, res) => res.json({ user: req.user }));
app.get("/profile/books", ensureAuth, async (req, res) => {
  const db = await dbInit();
  const books = await db.collection("books").find().toArray();
  res.json({ user: req.user, books });
});
app.get("/profile/readers", ensureAuth, async (req, res) => {
  const db = await dbInit();
  const readers = await db.collection("readers").find().toArray();
  res.json({ user: req.user, readers });
});

// Home
app.get("/", ensureAuth, (req, res) => res.send("Hello OAuth Readers & Books API!"));

// --------------------
// Swagger
// --------------------
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Readers & Books API",
      version: "1.0.0",
      description: "API sécurisée par OAuth pour gérer utilisateurs, livres et lecteurs",
    },
    servers: [{ url: "http://localhost:5500" }],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", ensureAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --------------------
// Start Server
// --------------------
async function startServer() {
  try {
    await dbInit();
    console.log("✅ MongoDB initialized");
    app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
  } catch (err) {
    console.error("❌ Cannot start server:", err);
    process.exit(1);
  }
}

startServer();
