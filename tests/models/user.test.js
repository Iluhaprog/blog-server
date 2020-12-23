const assert = require('assert');

const { UserApi, RoleApi } = require('../../src/models');
const { userData } = require('../initObjects');

describe('Test for user api', async function() {

    it('Should create user', async function() {
        try {
            userData.roleId = (await RoleApi.create('UserRole')).id;
            const newUser = await UserApi.create(userData);
            userData.id = newUser.id;
            userData.date = newUser.date;
            assert.deepStrictEqual(newUser, userData);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should check username for unique', async function() {
        try {
            const result = await UserApi.usernameIsUnique(userData.username);
            assert.strictEqual(result, false);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should check email for unique', async function() {
        try {
            const result = await UserApi.emailIsUnique(userData.email);
            assert.strictEqual(result, false);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get user by id', async function() {
        try {
            const user = await UserApi.getById(userData.id);
            userData.date = user.date;
            assert.deepStrictEqual(user, userData);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get user by username', async function() {
        try {
            const user = await UserApi.getByUsername(userData.username);
            assert.deepStrictEqual(user, userData);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get user by email', async function() {
        try {
            const user = await UserApi.getByEmail(userData.email);
            assert.deepStrictEqual(user, userData);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should update user', async function() {
        try {
            userData.username = 'USERNAME';
            await UserApi.update(userData);

            const user = await UserApi.getById(userData.id);
            assert.deepStrictEqual(user, userData);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should delete user', async function() {
        try {
            await UserApi.deleteById(userData.id);
            await RoleApi.deleteById(userData.roleId);
            const result = await UserApi.getById(userData.id);
            assert.deepStrictEqual(result, {});
        } catch (error) {
            console.error(error);
        }
    });
});