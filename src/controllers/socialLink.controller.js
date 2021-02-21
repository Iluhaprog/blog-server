const { SocialLinkApi, DirectoryApi, FileApi } = require('../models');

async function getById(req, res) {
    try {
        const { id } = req.query;
        const socialLink = await SocialLinkApi.getById(id);
        res.status(200).json(socialLink);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function getByUserId(req, res) {
    try {
        const { userId } = req.query;
        const socialLink = await SocialLinkApi.getByUserId(userId);
        res.status(200).json(socialLink);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function create(req, res) {
    try {
        const userId = req.user.id;
        const newSocialLink = {...req.body.socialLink, userId};
        const socialLink = await SocialLinkApi.create(newSocialLink);
        res.status(200).json(socialLink);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function update(req, res) {
    try {
        const { updatedSocialLink } = req.body;
        const userId = req.user.id;
        const socialLink = await SocialLinkApi.update({
            ...updatedSocialLink,
            userId,
        });
        res.status(200).json(socialLink);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function updatePreview(req, res) {
    try {
        const { socialLinkId } = req.query;
        const { pathname, filename, dirname } = req.file;
        const socialLink = await SocialLinkApi.getById(socialLinkId);
        const dir = await DirectoryApi.getByName(dirname); 
        const file = await FileApi.create({
            name: filename,
            path: pathname,
            directoryId: dir.id,
        });
        await SocialLinkApi.update({
            ...socialLink, 
            preview: file.name,
        });
        const updatedSocialLink = await SocialLinkApi.getById(socialLinkId);
        res.status(200).json(updatedSocialLink);
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

async function deleteById(req, res) {
    try{
        await SocialLinkApi.deleteById(req.query.id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error)
    }
}

module.exports = {
    getById,
    getByUserId,
    create,
    update,
    updatePreview,
    deleteById,
}