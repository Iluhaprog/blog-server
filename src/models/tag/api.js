const { Tag } = require('./model');
const { Post } = require('../post/model');

async function create(tag) {
    try {
        const newTag = await Tag.create(tag);
        return newTag ? newTag.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const tag = await Tag.findByPk(id);
        return tag ? tag.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getByPostId(postId) {
    try {
        // TO DO
        return [];
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await Tag.destroy({
            where: {
                id: id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}
module.exports = {
    create,
    getById,
    getByPostId,
    deleteById,
};