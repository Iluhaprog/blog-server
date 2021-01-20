const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { oneToMany } = require('../../libs/model');
const { File } = require('../file/model');
const { Post } = require('../post/model');

const Directory = sequelize.define('Directory', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }, 
    }, {
        tableName: 'directories',
        timestamps: false,
});

oneToMany(Directory, Post);
oneToMany(Directory, File);

module.exports = { 
    Directory,
};