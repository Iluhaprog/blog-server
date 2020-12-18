const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Tag = sequelize.define('Tag', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: false,
        }
    }, {
        tableName: 'tags',
        timestamps: false,
});

module.exports = { 
    Tag,
};