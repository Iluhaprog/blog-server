const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

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

module.exports = {
    Role,
};