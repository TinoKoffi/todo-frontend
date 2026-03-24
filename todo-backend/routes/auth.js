// routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../database");

const router = express.Router();

// Regex de validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function validateEmail(email) {
  return emailRegex.test(email);
}

function validatePassword(password) {
  return passwordRegex.test(password);
}

// POST /auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  if (username.trim().length < 3) {
    return res.status(400).json({ error: "Le nom doit faire au moins 3 caractères." });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "L'email n'est pas valide." });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({
      error: "Le mot de passe doit faire au moins 8 caractères, contenir une majuscule, une minuscule et un chiffre.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch {
    res.status(409).json({ error: "Nom d'utilisateur ou email déjà utilisé." });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: "L'email n'est pas valide." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Email ou mot de passe incorrect." });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;