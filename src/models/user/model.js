const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { Comment } = require('../comment/model');
const { Like } = require('../like/model');
const { Post } = require('../post/model');
const { Project } = require('../project/model');

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
        salt: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        skills: {
            type: DataTypes.STRING,
            defaultValue: '',
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

User.hasMany(Post, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

User.hasMany(Project, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

User.hasMany(Like, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

User.hasMany(Comment, {
    foreignKey: {
        name: 'userId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

module.exports = { 
    User,
};