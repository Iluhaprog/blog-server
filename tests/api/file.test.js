const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { RoleApi, UserApi, PostApi } = require('../../src/models');
const { userData, postData, fileData, auth } = require('../initObjects');

describe('Test for file api of app', async function() {
    let roleId = 0;

    it('Should create file', async function() {
        const role = await RoleApi.create('ROLE');
        roleId = role.id;
        userData.roleId = roleId;

        const user = await UserApi.create(userData);
        postData.userId = user.id;

        const post = await PostApi.create(postData);
        fileData.postId = post.id;

        const { body } = await request(app)
                            .post(`/file/create`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ file: fileData });
        fileData.id = body.id;
        fileData.date = body.date;
        assert.deepStrictEqual(body, fileData);
    });

    it('Should get file by id', async function() {
        const { body } = await request(app)
                            .get(`/file/getById?id=${fileData.id}`)
                            .send();
        fileData.date = body.date;
        assert.deepStrictEqual(body, fileData);
    });

    it('Should get files by post id', async function() {
        const { body } = await request(app)
                            .get(`/file/getByPostId?postId=${fileData.postId}`)
                            .send();
        assert.deepStrictEqual(body, [fileData]);
    });

    it('Should update file', async function() {
        fileData.name = 'newName.png';
        const { body } = await request(app)
                                .put(`/file/update`)
                                .set('Accept', 'application/json')
                                .set('Authorization', auth.header)
                                .send({ file: fileData });
        assert.deepStrictEqual(body, fileData);
    });

    it('Should delete file by id', async function() {
        const res = await request(app)
                        .delete(`/file/deleteById?id=${fileData.id}`)
                        .set('Authorization', auth.header)
                        .send();
        await RoleApi.deleteById(roleId);
        assert.strictEqual(res.status, 204);
    });

});