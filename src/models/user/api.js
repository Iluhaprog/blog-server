const { User } = require('./model');

async function usernameIsUnique(username) {
    try {
        const result = await getByUsername(username);
        return !result;
    } catch (error) {
        console.error(error);
    }
}

async function emailIsUnique(email) {
    try {
        const result = await getByEmail(email);
        return !result;
    } catch (error) {
        console.error(error);
    }
}

async function getById(id) {
    try {
        const result = await User.findByPk(id);
        return result ? result.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getByEmail(email) {
    try {
        const result = await User.findOne({
            where: {
                email: email,
            },
        });
        return result ? result.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getByUsername(username) {
    try {
        const result = await User.findOne({
            where: {
                username: username,
            },
        });
        return result ? result.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function create(user) {
    try {
        const result = await User.create(user, { raw: true });
        return result ? result.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function update(user) {
    try {
        await User.update(user, { 
            where: {
                id: user.id,
            },
            raw: true,
        });
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await User.destroy({ where: { id: id}});
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
    emailIsUnique,
    usernameIsUnique,
};