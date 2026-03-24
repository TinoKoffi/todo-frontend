require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const todosRoutes = require("./routes/todos");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todos", todosRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Todo API fonctionne ✅" });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});