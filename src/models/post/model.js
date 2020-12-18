const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/db');
const { Comment } = require('../comment/model');
const { File } = require('../file/model');
const { Like } = require('../like/model');
const { Tag } = require('../tag/model');

const Post = sequelize.define('Post', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            unique: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        preview: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        visible: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'posts',
        timestamps: false,
});

const PostTag = sequelize.define('PostTag', {
        postId: {
            type: DataTypes.INTEGER,
		    references: {
		      model: Post,
		      key: 'id'
		    }
        },
        tagId: {
            type: DataTypes.INTEGER,
		    references: {
		      model: Tag,
		      key: 'id'
		    }
        },
    }, {
        tableName: 'tags_posts',
        timestamps: false,
});

Post.hasMany(File, {
    foreignKey: {
        name: 'postId',
        allowNull: false,
    },
    onDelete: 'CASCADE',
});

Post.hasMany(Like, {
    foreignKey: {
        name: 'postId',
        allowNull: false,
    },
    onDelete: 'CASCADE',  
});

Post.hasMany(Comment, {
    foreignKey: {
        name: 'postId',
        allowNull: false,
    },
    onDelete: 'CASCADE',  
});

Post.belongsToMany(Tag, { 
    through: PostTag,
    foreignKey: 'postId',
    onDelete: 'CASCADE',
});

Tag.belongsToMany(Post, {
    through: PostTag,
    foreignKey: 'tagId',
    onDelete: 'CASCADE',
})

module.exports = {
    Post,
};