const { sequelize } = require('../config/db');

const { RoleApi } = require('./role');
const { UserApi } = require('./user');
const { PostApi } = require('./post');
const { FileApi } = require('./file');
const { ProjectApi } = require('./project');
const { LikeApi } = require('./like');
const { CommentApi } = require('./comment');
const { TagApi } = require('./tag');

const sync = async () => {
    await sequelize.sync({ alter: true });
};

module.exports = {
    RoleApi,
    UserApi,
    PostApi,
    FileApi,
    ProjectApi,
    LikeApi,
    CommentApi,
    TagApi,
    sync,
};