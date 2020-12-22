const { getPasswordHash } = require('../libs/crypt');
const { UserApi } = require('../models/');

async function getById(req, res) {
    try {
        const { id } = req.query;
        const user = await UserApi.getById(id);
        res.json(user);
    } catch (error) {
        console.error(error);
    }
}

async function getByEmail(req, res) {
    try {
        const { email } = req.query;
        const user = await UserApi.getByEmail(email);
        res.json(user);
    } catch (error) {
        console.error(error);
    }
}

async function getByUsername(req, res) {
    try {
        const { username } = req.query;
        const user = await UserApi.getByUsername(username);
        res.json(user);
    } catch (error) {
        console.error(error);
    }
}

async function create(req, res) {
    try {
        const { user } = req.body;
        const hash = await getPasswordHash(user.password);
        user.password = hash;
        const newUser = await UserApi.create(user);
        res.json(newUser);
    } catch (error) {
        console.log(error);
    }
}

async function update(req, res) {
    try {
        const { user } = req.body;
        await UserApi.update(user);
        const updatedUser = await UserApi.getById(user.id);
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await UserApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getById,
    getByEmail,
    getByUsername,
    create,
    update,
    deleteById,
};