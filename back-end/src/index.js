const express = require('express');
const bodyParser = require('body-parser');
const sampleController = require('./controllers/sampleController');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const sampleCtrl = new sampleController();
authRoutes(app); // Set up authentication routes

// Define sample routes
app.get('/sample', sampleCtrl.getSample.bind(sampleCtrl));
app.post('/sample', sampleCtrl.postSample.bind(sampleCtrl));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});