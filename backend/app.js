const path = require('path');
const logger = require("morgan"); // to log user requested url on server
const dotenv = require("dotenv"); // to config envirnment
const cors = require("cors"); // for cross-origin resource shearing at http.
const bluebird = require("bluebird"); // used for creatin promise
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const compression = require("compression");

const expressValidator = require("express-validator");
const session = require('express-session');

const app = express();
dotenv.config({path: ".env"});
app.set("port", process.env.PORT);

const mongoUrl = process.env.TEST ? process.env.MONGO_TEST : process.env.MONGO_URI;
(mongoose).Promise = bluebird;
mongoose.connect(mongoUrl, {useNewUrlParser: true})
        .then(() => console.log("Connected to Mongo DB"))
.catch(err =>console.log("MongoDB connection error. Please make sure MongoDB is running. " + err));

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(expressValidator());

app.use(cors());

app.get('/', function(req, res){ 
    res.send('<html>all is well...</html>');
});



module.exports = app;