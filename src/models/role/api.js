const { User } = require('../user/model');
const { Role } = require('./model');

async function create(roleName) {
    try {
        const result = await Role.create({ role: roleName });
        return result ? result.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getById(roleId) {
    try {
        const result = await Role.findByPk(roleId);
        return result ? result.get({ plain: true }) : {};
    } catch (error) {
        console.error(error);
    }
}

async function getByUser(user) {
    try {
        const result = await getById(user.roleId);
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        return await Role.destroy({ 
            where: {
                id: id
            }
        });
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    create,
    getById,
    getByUser,
    deleteById,
};