const express = require("express");
const app = express();
const port = 3000;

const authRoutes = require("./src/controllers/loginController");

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Olá, mundo!");
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
