const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const SocialLink = sequelize.define('SocialLink', {
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
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        link: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        tableName: 'social_links',
        timestamps: false,
});

module.exports = { SocialLink };