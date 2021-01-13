const { getPasswordHash } = require('../libs/crypt');
const { UserApi } = require('../models/');

async function login(req, res) {
    try {
        res.json(req.user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function logout(req, res) {
    try {
        req.logout();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function getById(req, res) {
    try {
        const { id } = req.query;
        const user = await UserApi.getById(id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function getAll(req, res) {
    try {
        const users = await UserApi.getAll();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function getByEmail(req, res) {
    try {
        const { email } = req.query;
        const user = await UserApi.getByEmail(email);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function getByUsername(req, res) {
    try {
        const { username } = req.query;
        const user = await UserApi.getByUsername(username);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
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
        res.status(400).send(error);
    }
}

async function update(req, res) {
    try {
        const { user } = req.body;
        const userData = { ...user, id: req.user.id };
        await UserApi.update(userData);
        const updatedUser = await UserApi.getById(req.user.id);
        res.json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

async function remove(req, res) {
    try {
        const { id } = req.user;
        await UserApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

async function deleteById(req, res) {
    try {
        const { id } = req.query;
        await UserApi.deleteById(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
}

module.exports = {
    getById,
    getAll,
    getByEmail,
    getByUsername,
    create,
    update,
    remove,
    deleteById,
    login,
    logout,
};