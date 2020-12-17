const { sequelize } = require('../config/db');

const { RoleApi } = require('./role/index');
const { UserApi } = require('./user/index');
const { PostApi } = require('./post/index');
const { FileApi } = require('./file/index');
const { ProjectApi } = require('./project/index');

const sync = async () => {
    await sequelize.sync({ alter: true });
};

module.exports = {
    RoleApi,
    UserApi,
    PostApi,
    FileApi,
    ProjectApi,
    sync,
};