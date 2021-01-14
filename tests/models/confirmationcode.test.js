const assert = require('assert');

const { ConfirmationCodeApi, UserApi } = require('../../src/models');
const { userData, confirmData } = require('../initObjects');

describe('Test confirm code api', async function() {
    it('Should create', async function() {
        const user = await UserApi.create(userData);
        confirmData.userId = user.id;

        const confirm = await ConfirmationCodeApi.create(confirmData);
        confirmData.id = confirm.id;
        assert.deepStrictEqual(confirm, confirmData);
    });
    it('Should get by code', async function() {
        const confirm = await ConfirmationCodeApi.getByCode(confirmData.code);
        assert.deepStrictEqual(confirm, confirmData);
    });
    it('Should delete by id', async function() {
        await ConfirmationCodeApi.deleteById(confirmData.id);
        
        const confirm = await ConfirmationCodeApi.getByCode(confirmData.code);
        
        await UserApi.deleteById(confirmData.userId);
        assert.deepStrictEqual(confirm, {});
    });
})