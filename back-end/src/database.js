require("dotenv").config();
const mongoose = require("mongoose");

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@taskbuddy.v9rv6nt.mongodb.net/?retryWrites=true&w=majority&appName=TaskBuddy`;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão:"));
db.once("open", () => {
  console.log("Conectado ao MongoDB!");
});

module.exports = db;
