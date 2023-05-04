require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


// Ici, nous stockons la chaîne dans une variable appelée mongoString.
const mongoString = process.env.DATABASE_URL

// connectons la base de données à notre serveur en utilisant Mongoose
mongoose.connect(mongoString);
const database = mongoose.connection
// database.on signifie qu'il se connectera à la base de données et lancera une erreur si la connexion échoue
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const bodyParser = require('body-parser');
const cors = require('cors')
var io = require("socket.io");
var ws = require('ws');

const routes = require('./routes/routes');
const app = express();

app.use(express.json());

app.use(bodyParser.json());
app.use(cors({origin: '*'}))

app.use('/api', routes)

app.listen(8000, () => {
    console.log(`Server Started at ${8000}`)
 })