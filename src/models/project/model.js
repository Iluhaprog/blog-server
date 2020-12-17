const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');

const Project = sequelize.define('Project', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        projectLink: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
        },
        githubLink: {
            type: DataTypes.STRING(200),
            allowNull: false,
            defaultValue: '',
        },
    }, {
        tableName: 'projects',
        timestamps: false,
});

module.exports = {
    Project,
};