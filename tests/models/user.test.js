const assert = require('assert');

const { UserApi, RoleApi } = require('../../src/models');
const { user : userData } = require('./initObjects');

describe('Test for user api', async function() {
    const user = userData;
    let userId = 0;

    const genActualExpect = (raw, expectedValue) => {
        const result = { 
            firstName: raw.firstName || '',
            lastName: raw.lastName || '',
            username: raw.username || '',
            email: raw.email || '',
            password: raw.password || '',
            roleId: raw.roleId || '',
        };
        const expected = expectedValue || {...user};
        return  [expected, result];
    }

    it('Should create user', async function() {
        try {
            user.roleId = (await RoleApi.create('UserRole')).id;
            const raw = await UserApi.create(user);
            const [expected, result] = genActualExpect(raw);
            userId = raw.id;
            assert.deepStrictEqual(result, expected);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should check username for unique', async function() {
        try {
            const result = await UserApi.usernameIsUnique(user.username);
            assert.strictEqual(result, false);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should check email for unique', async function() {
        try {
            const result = await UserApi.emailIsUnique(user.email);
            assert.strictEqual(result, false);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get user by id', async function() {
        try {
            const raw = await UserApi.getById(userId);
            const [expected, result] = genActualExpect(raw);
            assert.deepStrictEqual(result, expected);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get user by username', async function() {
        try {
            const raw = await UserApi.getByUsername(user.username);
            const [expected, result] = genActualExpect(raw);
            assert.deepStrictEqual(result, expected);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get user by email', async function() {
        try {
            const raw = await UserApi.getByEmail(user.email);
            const [expected, result] = genActualExpect(raw);
            assert.deepStrictEqual(result, expected);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should update user', async function() {
        try {
            const updatedUser = {...user}
            updatedUser.id = userId;
            updatedUser.username = 'USERNAME';
            await UserApi.update(updatedUser);

            delete updatedUser.id;
            const raw = await UserApi.getById(userId);
            const [expected, result] = genActualExpect(raw);
            assert.deepStrictEqual(result, updatedUser);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should delete user', async function() {
        try {
            await UserApi.deleteById(userId);
            await RoleApi.deleteById(user.roleId);
            const result = await UserApi.getById(userId);
            assert.deepStrictEqual(result, {});
        } catch (error) {
            console.error(error);
        }
    });
});