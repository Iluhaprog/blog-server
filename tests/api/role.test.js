const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');

describe('Test for role api of app', async function() {
    const role = 'ROLE';
    let roleId = 0;

    it('Should create role', async function() {
        const { body } = await request(app)
                        .post(`/role/create?role=${role}`)
                        .send();
        roleId = body.id;
        assert.deepStrictEqual({id: roleId, role}, body);
    });

    it('Should get role by id', async function() {
        const { body } = await request(app)
                            .get(`/role/getById?id=${roleId}`)
                            .send();
        assert.deepStrictEqual({id: roleId, role}, body);
    });

    it('Should delete role', async function() {
        const res = await request(app)
                            .delete(`/role/deleteById?id=${roleId}`)
                            .send();
        assert.strictEqual(res.status, 204);
    });

});