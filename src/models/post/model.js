const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { File } = require('../file/model');

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

Post.hasMany(File, {
    foreignKey: {
        name: 'postId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

module.exports = {
    Post,
};