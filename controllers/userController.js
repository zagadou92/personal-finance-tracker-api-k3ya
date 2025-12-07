// controllers/userController.js
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';
import { USER_COLLECTION } from '../models/User.js';

// Validation schemas
const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required()
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string()
}).min(1);

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await req.db.collection(USER_COLLECTION).find({}).toArray();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await req.db.collection(USER_COLLECTION).findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// CREATE new user
export const createUser = async (req, res) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { email, password, name } = req.body;

    // Check if email already exists
    const existing = await req.db.collection(USER_COLLECTION).findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { email, password: hashedPassword, name, createdAt: new Date() };

    const result = await req.db.collection(USER_COLLECTION).insertOne(user);
    res.status(201).json({ _id: result.insertedId, ...user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const updateData = { ...req.body };

    // Hash password if it's being updated
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const result = await req.db.collection(USER_COLLECTION).updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const result = await req.db.collection(USER_COLLECTION).deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
