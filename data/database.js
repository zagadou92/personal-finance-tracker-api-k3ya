import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement depuis .env

let _client = null; // Client MongoDB global
let _db = null;     // Référence à la DB spécifique

/**
 * Initialise la connexion à MongoDB
 */
export async function dbInit() {
  if (_client && _db) {
    console.log("✅ Database already initialized");
    return _db;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("❌ MONGO_URI is not defined in .env");
  }

  try {
    console.log("🔄 Connecting to MongoDB...");

    _client = new MongoClient(uri);
    await _client.connect();

    // Vérifier que la connexion est active
    await _client.db().command({ ping: 1 });

    const dbName = process.env.DB_NAME || "contactsdb";
    _db = _client.db(dbName);

    console.log(`✅ Connected to MongoDB (DB: ${dbName})`);
    return _db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    _client = null;
    _db = null;
    throw error;
  }
}

/**
 * Récupère l'objet MongoClient
 */
export function getDbClient() {
  if (!_client) throw new Error("❌ Database not initialized.");
  return _client;
}

/**
 * Récupère l'objet DB
 */
export function getDb() {
  if (!_db) throw new Error("❌ Database not initialized.");
  return _db;
}

/**
 * Ferme la connexion MongoDB proprement
 */
export async function closeDb() {
  if (_client) {
    await _client.close();
    _client = null;
    _db = null;
    console.log("✅ MongoDB connection closed");
  }
}
