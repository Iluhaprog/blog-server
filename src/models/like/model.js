const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Like = sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },        
    }, {
        tableName: 'likes',
        timestamps: false,
});

module.exports = {
    Like,
};