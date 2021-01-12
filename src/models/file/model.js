const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const File = sequelize.define('File', {
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
        path: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'files',
        timestamps: false,
});

module.exports = {
    File,
};