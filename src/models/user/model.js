const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { Comment } = require('../comment/model');
const { Like } = require('../like/model');
const { Post } = require('../post/model');
const { Project } = require('../project/model');
const { oneToMany } = require('../../libs/model');
const { ConfirmationCode } = require('../confirmation_code/model');
const { SocialLink } = require('../social_link/model');

const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        avatarImage: {
            type: DataTypes.STRING(150),
            defaultValue: '',
        },
        firstName: {
            type: DataTypes.STRING(50),
            defaultValue: '',
        },
        lastName: {
            type: DataTypes.STRING(50),
            defaultValue: '',
        },
        username: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        skills: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        confirmed: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'users',
        timestamps: false,
});

oneToMany(User, Post);
oneToMany(User, Project);
oneToMany(User, Like);
oneToMany(User, Comment);
oneToMany(User, ConfirmationCode);
oneToMany(User, SocialLink);

module.exports = { 
    User,
};