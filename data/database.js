import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let _client = null;
let _db = null;

// Noms des collections
const COLLECTIONS = {
  USERS: "users",
  ACCOUNTS: "accounts",
  TRANSACTIONS: "transactions",
  CATEGORIES: "categories",
};

/**
 * Initialise la connexion à MongoDB
 */
export async function dbInit() {
  if (_client && _db) {
    console.log("✅ Database already initialized");
    return _db;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("❌ MONGO_URI is not defined in .env");

  try {
    console.log("🔄 Connecting to MongoDB...");
    _client = new MongoClient(uri);
    await _client.connect();

    // Vérifier que la connexion est active
    await _client.db().command({ ping: 1 });

    const dbName = process.env.DB_NAME || "projectdb";
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

/**
 * Fonctions CRUD génériques pour une collection
 */
export async function findAll(collectionName) {
  const db = getDb();
  return db.collection(collectionName).find().toArray();
}

export async function findById(collectionName, id) {
  const db = getDb();
  if (!ObjectId.isValid(id)) throw new Error("❌ Invalid ID");
  return db.collection(collectionName).findOne({ _id: new ObjectId(id) });
}

export async function insertOne(collectionName, data) {
  const db = getDb();
  const result = await db.collection(collectionName).insertOne(data);
  return result.insertedId;
}

export async function updateById(collectionName, id, data) {
  const db = getDb();
  if (!ObjectId.isValid(id)) throw new Error("❌ Invalid ID");
  const result = await db
    .collection(collectionName)
    .updateOne({ _id: new ObjectId(id) }, { $set: data });
  return result.modifiedCount;
}

export async function deleteById(collectionName, id) {
  const db = getDb();
  if (!ObjectId.isValid(id)) throw new Error("❌ Invalid ID");
  const result = await db
    .collection(collectionName)
    .deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount;
}

// Exporter les noms de collection pour éviter les erreurs de frappe
export { COLLECTIONS };
