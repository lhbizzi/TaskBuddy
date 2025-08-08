import express from "express";
import bodyParser from "body-parser";
import SampleController from "./controllers/sampleController";
import authRoutes from "./routes/authRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const sampleCtrl = new SampleController();
authRoutes(app); // Set up authentication routes

// Define sample routes
app.get("/sample", sampleCtrl.getSample.bind(sampleCtrl));
app.post("/sample", sampleCtrl.postSample.bind(sampleCtrl));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
