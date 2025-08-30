require("dotenv").config();
const mongoose = require("mongoose");

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const uri = `mongodb+srv://${dbUser}:${dbPass}@taskbuddy.v9rv6nt.mongodb.net/?retryWrites=true&w=majority&appName=TaskBuddy`;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado ao MongoDB!");
  })
  .catch((error) => {
    console.error("Erro de conexão:", error);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Erro de conexão:"));
db.once("open", () => {
  console.log("Conectado ao MongoDB!");
});

module.exports = db;
