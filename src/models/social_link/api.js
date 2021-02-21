const { SocialLink } = require('./model');
const { getModelData, getModelsDataArray } = require('../../libs/model');

async function getById(id) {
    try {
        const socialLink = await SocialLink.findByPk(id);
        return getModelData(socialLink);
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    try {
        const socialLinks = await SocialLink.findAll({
            where: { userId },
        });
        return getModelsDataArray(socialLinks);
    } catch (error) {
        console.error(error);
    }
}

async function create(socialLink) {
    try {
        const newSocialLink = await SocialLink.create(socialLink);
        return getModelData(newSocialLink)
    } catch (error) {
        console.error(error);
    }
}

async function update(socialLink) {
    try {
        await SocialLink.update(socialLink, {
            where: { id: socialLink.id }
        });
        return await getById(socialLink.id);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await SocialLink.destroy({
            where: { id },
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getById,
    getByUserId,
    create,
    update,
    deleteById,
};