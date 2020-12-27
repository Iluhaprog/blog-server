require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('./passport');
const session = require('express-session');
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
}));

app.use(passport.initialize());
app.use(passport.session());

module.exports = {
    app,
    express, 
    passport,
    port: process.env.PORT
}