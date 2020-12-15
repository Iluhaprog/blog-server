const { Role } = require('./model');

async function create(roleName) {
    try {
        const { id, role } = await Role.create({ role: roleName });
        return { id: id, role: role };
    } catch (error) {
        console.error(error);
    }
}

async function getById(roleId) {
    try {
        const { id, role } = await Role.findByPk(roleId) || {};
        const result = (!id && !role) ? {} : { id: id, role: role };
        return result;
    } catch (error) {
        console.error(error);
    }
}

async function getByUserId(userId) {
    // to do
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
    getByUserId,
    deleteById,
};