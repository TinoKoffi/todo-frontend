// routes/todos.js

const express = require("express");
const prisma = require("../database");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

// GET /todos
router.get("/", async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(todos);
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// POST /todos
router.post("/", async (req, res) => {
  const { text, priority } = req.body;
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Le texte est requis." });
  }
  try {
    const todo = await prisma.todo.create({
      data: {
        text: text.trim(),
        priority: priority ?? "Moyenne",
        userId: req.userId,
      },
    });
    res.status(201).json(todo);
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// PUT /todos/:id
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { text, priority } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Le texte est requis." });
  }

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.userId) {
      return res.status(404).json({ error: "Todo introuvable." });
    }
    if (todo.locked) {
      return res.status(403).json({ error: "Cette tâche est verrouillée." });
    }
    const updated = await prisma.todo.update({
      where: { id },
      data: { text: text.trim(), priority: priority ?? todo.priority },
    });
    res.json(updated);
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// PATCH /todos/:id/complete
router.patch("/:id/complete", async (req, res) => {
  const id = parseInt(req.params.id);
  const { customMessage } = req.body;

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.userId) {
      return res.status(404).json({ error: "Todo introuvable." });
    }

    const updated = await prisma.todo.update({
      where: { id },
      data: { completed: true, locked: true },
    });

    // Répondre immédiatement
    res.json(updated);

    // Envoyer email en arrière-plan
    sendCompletionEmail(
      null,
      "Tino",
      todo.text,
      customMessage || "Bravo, continue comme ça ! 💪"
    ).catch((err) => console.error("Erreur email:", err));

  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

// DELETE /todos/:id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo || todo.userId !== req.userId) {
      return res.status(404).json({ error: "Todo introuvable." });
    }
    await prisma.todo.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Erreur serveur." });
  }
});

module.exports = router;