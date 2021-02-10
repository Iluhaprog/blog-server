const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Home = sequelize.define('Home', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        tableName: 'home',
        timestamps: false,
});

module.exports = {
    Home,
};