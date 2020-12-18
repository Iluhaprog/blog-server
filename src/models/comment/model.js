const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'comments',
        timestamps: false,
});

module.exports = {
    Comment,
};