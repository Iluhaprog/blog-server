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
        const post = await Post.findByPk(postId, {
            include: [{
                model: Tag,
            }],
        });
        const tags = post.Tags.map(tag => {
            const tagData = tag.get({ plain: true });
            delete tagData.PostTag;
            return tagData;
        });
        return tags;
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