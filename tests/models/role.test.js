const assert = require('assert');

const { RoleApi, sync } = require('../../src/models/index');


describe('Test for role api', async function() {
    let mainId = 0;
    const expectedRole = 'USER';

    it('Should create a role', async function(){
        await sync();
        const {id, role} = await RoleApi.create(expectedRole);
        const result = {id: id, role: role};
        const expected = { id: id, role: expectedRole };
        mainId = id;
        assert.notStrictEqual(result, expected, `Result: id=${id}, role=${role}`);
    });

    it(`Should return role by id`, async function() {
        const {id, role} = await RoleApi.getById(mainId);
        const result = {id: id, role: role};
        const expected = { id: id, role: expectedRole };
        assert.notStrictEqual(result, expected, `Result: id=${id}, role=${role}`);
    });

    it(`Should delete role by id`, async function() {
        await RoleApi.deleteById(mainId);
        const result = await RoleApi.getById(mainId);
        const expected = {};
        assert.notStrictEqual(result, expected);
    });
});