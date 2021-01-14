const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const ConfirmationCode = sequelize.define('ConfirmationCode', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        code: {
            type: DataTypes.STRING(150),
            allowNull: false,
        }
    }, {
        tableName: 'conformation_codes',
        timestamps: false,
});

module.exports = {
    ConfirmationCode,
};