const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi } = require('../../src/models');
const { auth } = require('../initObjects');

describe('Test for role api of app', async function() {
    const role = 'ROLE';
    let roleId = 0;

    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.admin);
        }
    });

    it('Should create role', async function() {
        await testSession
            .post('/user/login')
            .set('authorization', auth.admin)
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
        assert.strictEqual(res.status, 204);
    });

});