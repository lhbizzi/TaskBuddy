const express = require("express");
const cors = require("cors");
const app = express();
require("./src/database");
const port = 3000;

const authRoutes = require("./src/routes/loginRoutes");
const taskRoutes = require("./src/routes/taskRoutes");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
