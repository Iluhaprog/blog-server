const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const { User } = require('./../user/model');
const { oneToMany } = require('../../libs/model.lib');

const Role = sequelize.define('Role', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        tableName: 'roles',
        timestamps: false,
});

oneToMany(Role, User);

module.exports = {
    Role,
};