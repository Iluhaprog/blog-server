const { sequelize } = require('../config/db');

const { RoleApi } = require('./role/index');
const { UserApi } = require('./user/index');

const sync = async () => {
    await sequelize.sync({ alter: true });
};

module.exports = {
    RoleApi,
    UserApi,
    sync,
};