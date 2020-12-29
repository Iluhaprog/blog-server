const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi } = require('../../src/models');
const { auth, userData } = require('../initObjects');

describe('Test for role api of app', async function() {
    const role = 'ROLE';
    const user = {...userData};
    let roleId = 0;

    it('Should create role', async function() {
        const newRole = await RoleApi.create('User' + Date.now());
        user.roleId = newRole.id;

        const res = await request(app)
                            .post('/user/create')
                            .set('Accept', 'application/json')
                            .send({ user: user });
        user.id = res.body.id;

        const { body } = await request(app)
                        .post(`/role/create?role=${role}`)
                        .set('Authorization', auth.header)
                        .send();
        roleId = body.id;
        assert.deepStrictEqual({id: roleId, role}, body);
    });

    it('Should get role by id', async function() {
        const { body } = await request(app)
                            .get(`/role/getById?id=${roleId}`)
                            .set('Authorization', auth.header)
                            .send();
        assert.deepStrictEqual({id: roleId, role}, body);
    });

    it('Should delete role', async function() {
        const res = await request(app)
                            .delete(`/role/deleteById?id=${roleId}`)
                            .set('Authorization', auth.header)
                            .send();
        await RoleApi.deleteById(roleId);
        await UserApi.deleteById(user.id);
        assert.strictEqual(res.status, 204);
    });

});