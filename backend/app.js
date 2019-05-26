const path = require('path');
const logger = require("morgan"); // to log user requested url on server
const dotenv = require("dotenv"); // to config envirnment
const cors = require("cors"); // for cross-origin resource shearing at http.
const bluebird = require("bluebird"); // used for creating promise
const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const compression = require("compression");
const lusca = require("lusca");

const expressValidator = require("express-validator");
const session = require('express-session');
const MongoStore = require("connect-mongo")(session)

const app = express();
dotenv.config({path: ".env"});
app.set("port", process.env.PORT);

const mongoUrl = process.env.NODE_ENV=="test" ? process.env.MONGO_TEST : process.env.MONGO_URI;

(mongoose).Promise = bluebird;
mongoose.connect(mongoUrl)
        .then(() => console.log("Connected to Mongo DB"))
.catch(err =>console.log("MongoDB connection error. Please make sure MongoDB is running. " + err));


app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());

app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));

app.use(cors());
app.use(logger('dev'));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Expose-Headers", "Authorization");
    next();
});

const user = require("./src/routes/user");
const auth = require("./src/routes/auth");

app.use("/user", user);
app.use("/login", auth);

app.get('/', function(req, res){ 
    res.send('<html>all is well...</html>');
});



module.exports = app;