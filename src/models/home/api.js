const { getModelData } = require('../../libs/model');
const { Home } = require('./model');

async function update(home) {
    try {
        await Home.update(home, {
            where: {
                id: home.id,
            },
        });
    } catch (error) {
        console.error(error);
    }
}

async function get() {
    try {
        const home = await Home.findOne();
        return getModelData(home);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    update,
    get,
};