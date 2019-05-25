// const path = require('path');
// const logger = require("morgan"); // to log user requested url on server
const dotenv = require("dotenv"); // to config envirnment
const express = require("express");
// const mongoose = require('mongoose');
// const mongo = require("connect-mongo")
// const bodyParser = require("body-parser");


const app = express();
dotenv.config({path: ".env"});
app.set("port", process.env.PORT);



app.get('/', function(req, res){ 
    res.send('<html>all is well...</html>');
});



module.exports = app;