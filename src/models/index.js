const { sequelize } = require('../config/db');
const { RoleApi } = require('./role/index');

const sync = async () => {
    await sequelize.sync({ alter: true });
};

module.exports = {
    RoleApi,
    sync,
};