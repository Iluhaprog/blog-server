const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { Comment } = require('../comment/model');
const { File } = require('../file/model');
const { Like } = require('../like/model');
const { Tag } = require('../tag/model');
const { oneToMany, manyToMany } = require('../../libs/model');

const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        dirname: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'posts',
        timestamps: false,
});

const PostTag = sequelize.define('PostTag', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
    }, {
        tableName: 'tags_posts',
        timestamps: false,
});

oneToMany(Post, File);
oneToMany(Post, Like);
oneToMany(Post, Comment);

manyToMany(Post, Tag, PostTag);

module.exports = {
    Post,
    PostTag,
};