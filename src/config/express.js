require('dotenv').config();

const express = require('express');
const app = express();


module.exports = {
    app,
    port: process.env.PORT
}