require('dotenv').config();
const { Sequelize } = require('sequelize');

const name = process.env.DB_NAME;
const user = process.env.DB_USER;
const pass = process.env.DB_PASS;
const host = process.env.DB_HOST;

const sequelize = new Sequelize(name, user, pass, {
    host: host,
    dialect: 'mysql',
    logging: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

try {
    sequelize.authenticate();
} catch(err) {
    console.error(err);
}

module.exports = {
    sequelize
};