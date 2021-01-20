require('dotenv').config();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('./passport');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');
const cors = require('cors');

const corsOptions = {
    credentials: true,
    preflightContinue: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "HEAD", "PATCH", "DELETE"],
    origin: process.env.ORIGIN_URL,
};

const app = express();
const RedisStore = connectRedis(session);
const redisClient = redis.createClient();

redisClient.on('error', function (err) {
    console.log('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}));

app.enable('trust proxy');

app.use(passport.initialize());
app.use(passport.session());
app.use(cors(corsOptions));

module.exports = {
    app,
    express, 
    passport,
    port: process.env.PORT,
}