const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(bodyparser.json())

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const AuthRoutes = require('./routes/authRoutes');
app.use(bodyparser.json());
app.use(AuthRoutes);

app.listen(process.env.PORT || 8000, () => {
  console.log(`turn on server: http://localhost:${process.env.PORT || 8000}`);
});