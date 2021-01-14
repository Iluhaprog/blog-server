const { ConfirmationCode } = require('./model');
const { getModelData } = require('../../libs/model');

async function create(confirmationCode) {
    try {
        const newConfirmationCode = await ConfirmationCode.create(confirmationCode);
        return getModelData(newConfirmationCode);
    } catch (error) {
        console.error(error);
    }
}

async function getByCode(code) {
    try {
        const confirmationCode = await ConfirmationCode.findOne({
            where: {
                code: code,
            },
        });
        return getModelData(confirmationCode);
    } catch (error) {
        console.error(error);
    }
}

async function deleteById(id) {
    try {
        await ConfirmationCode.destroy({
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
    getByCode,
    deleteById,
};