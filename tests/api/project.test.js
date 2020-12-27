const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi } = require('../../src/models');
const { userData, projectData, auth } = require('../initObjects');

describe('Test for project api of app', async function() {
    let roleId = 0;

    it('Should create project', async function() {
        const role = await RoleApi.create('ROLE');
        roleId = role.id;
        userData.roleId = roleId;
        const user = await UserApi.create(userData);
        projectData.userId = user.id;
        const { body } = await request(app)
                        .post(`/project/create`)
                        .set('Authorization', auth.header)
                        .send({ project: projectData });
        projectData.id = body.id;

        assert.deepStrictEqual(body, projectData);
    });

    it('Should get project by id', async function() {
        const { body } = await request(app)
                                .get(`/project/getById?id=${projectData.id}`)
                                .send();
        assert.deepStrictEqual(body, projectData);
    });

    it('Should get all projects', async function() {
        const res = await request(app)
                            .get(`/project/getAll`)
                            .send();
        assert.deepStrictEqual(res.body, [projectData]);
    });

    it('Should get projects by user id', async function() {
        const { body } = await request(app)
                                .get(`/project/getByUserId?userId=${projectData.userId}`)
                                .send();
        assert.deepStrictEqual(body, [projectData]);
    });

    it('Should update project', async function() {
        projectData.title = 'New title';
        const { body } = await request(app)
                            .put(`/project/update`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ project: projectData });
        assert.deepStrictEqual(body, projectData);
    });

    it('Should delete by id', async function() {
        const res = await request(app)
                            .delete(`/project/deleteById?id=${projectData.id}`)
                            .set('Authorization', auth.header)
                            .send();
        await RoleApi.deleteById(roleId);
        assert.strictEqual(res.status, 204);
    });
}); 