const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi } = require('../../src/models');
const { auth, userData } = require('../initObjects');

describe('Test for role api of app', async function() {
    const role = 'ROLE';
    const user = {...userData};
    let roleId = 0;

    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.header);
        }
    });

    it('Should create role', async function() {
        const newRole = await RoleApi.create('User' + Date.now());
        user.roleId = newRole.id;

        const res = await testSession
                            .post('/user/create')
                            .set('Accept', 'application/json')
                            .send({ user: user });
        user.id = res.body.id;
        await testSession
            .post('/user/login')
            .set('authorization', auth.header)
            .send();

        const { body } = await testSession
                        .post(`/role/create?role=${role}`)
                        .send();
        roleId = body.id;
        assert.deepStrictEqual({id: roleId, role}, body);
    });

    it('Should get role by id', async function() {
        const { body } = await testSession
                            .get(`/role/getById?id=${roleId}`)
                            .send();
        assert.deepStrictEqual({id: roleId, role}, body);
    });

    it('Should delete role', async function() {
        const res = await testSession
                            .delete(`/role/deleteById?id=${roleId}`)
                            .send();
        await testSession.post('/user/logout').send();
        await RoleApi.deleteById(roleId);
        await UserApi.deleteById(user.id);
        assert.strictEqual(res.status, 204);
    });

});