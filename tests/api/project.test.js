const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi } = require('../../src/models');
const { userData, projectData, auth } = require('../initObjects');

describe('Test for project api of app', async function() {
    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.header);
        }
    });

    it('Should create project', async function() {
        const user = await UserApi.create(userData);
        projectData.userId = user.id;
        await testSession
            .post('/user/login')
            .set('authorization', auth.header)
            .send();
        const { body } = await testSession
                        .post(`/project/create`)
                        .set('Authorization', auth.header)
                        .send({ project: projectData });
        projectData.id = body.id;
        assert.deepStrictEqual(body, projectData);
    });

    it('Should get project by id', async function() {
        const { body } = await testSession
                                .get(`/project/getById?id=${projectData.id}`)
                                .send();
        assert.deepStrictEqual(body, projectData);
    });

    it('Should get all projects', async function() {
        const res = await testSession
                            .get(`/project/getAll`)
                            .send();
        assert.deepStrictEqual(res.body, [projectData]);
    });

    it('Should get projects by user id', async function() {
        const { body } = await testSession
                                .get(`/project/getByUserId?userId=${projectData.userId}`)
                                .send();
        assert.deepStrictEqual(body, [projectData]);
    });

    it('Should update project', async function() {
        projectData.title = 'New title';
        const { body } = await testSession
                            .put(`/project/update`)
                            .set('Accept', 'application/json')
                            .send({ project: projectData });
        assert.deepStrictEqual(body, projectData);
    });

    it('Should delete by id', async function() {
        const res = await testSession
                            .delete(`/project/deleteById?id=${projectData.id}`)
                            .send();
        await testSession.post('/user/logout').send();
        await UserApi.deleteById(projectData.userId);
        assert.strictEqual(res.status, 204);
    });
}); 