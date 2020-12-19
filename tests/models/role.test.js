const assert = require('assert');

const { RoleApi, UserApi, sync } = require('../../src/models');
const { user: userData } = require('./initObjects');


describe('Test for role api', async function() {
    let mainId = 0;
    const expectedRole = 'USER';

    const msg = (id, role) => `Result: id=${id}, role=${role}`

    it('Should create a role', async function(){
        try {
            await sync();
            const result = await RoleApi.create(expectedRole);
            const expected = { id: result.id, role: expectedRole };
            mainId = result.id;
            assert.notStrictEqual(result, expected, msg(result.id, result.role));
        } catch (error) {
            console.error(error);
        }
    });

    it(`Should return role by id`, async function() {
        try {
            const result = await RoleApi.getById(mainId);
            const expected = { id: result.id, role: expectedRole };
            assert.notStrictEqual(result, expected, msg(result.id, result.role));
        } catch (error) {
            console.error(error);
        }
    });

    it(`Should return role by user`, async function() {
        try {
            userData.roleId = mainId;
            const user = await UserApi.create(userData);
            const role = await RoleApi.getByUser(user);
            await UserApi.deleteById(user.id);
            assert.strictEqual(role.id, mainId);
        } catch (error) {
            console.error(error);
        }
    });

    it(`Should delete role by id`, async function() {
        try {
            await RoleApi.deleteById(mainId);
            const result = await RoleApi.getById(mainId);
            const expected = {};
            assert.notStrictEqual(result, expected);
        } catch (error) {
            console.error(error);
        }
    });
});