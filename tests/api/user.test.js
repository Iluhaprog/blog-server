const request = require('supertest');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi } = require('../../src/models');
const { userData, auth } = require('../initObjects');

describe('Test for user api of app', async function() {
    const user = userData;

    it('Should create user', async function() {
        const res = await request(app)
                                .post('/user/create')
                                .set('Accept', 'application/json')
                                .send({ user: user });
        const newUser = res.body;

        user.id = newUser.id;
        user.roleId = parseInt(newUser.roleId);
        newUser.roleId = parseInt(newUser.roleId);
        user.password = newUser.password;
        user.date = newUser.date;

        assert.deepStrictEqual(newUser, user);

    });

    it('Should get by id', async function() { 
        const res = await request(app)
                            .get(`/user/getById?id=${user.id}`)
                            .send();
        user.date = res.body.date;
        assert.deepStrictEqual(res.body, user);
    });

    it('Should login user', async function() {
        const { body } = await request(app)
                                .post(`/user/login`)
                                .set('Accept', 'application/json')
                                .set('Authorization', auth.header)
                                .send();
        assert.deepStrictEqual(body, user);
    });

    it('Should logout user', async function() {
        const { status } = await request(app)
                                .post(`/user/logout?${auth.row}`)
                                .set('Accept', 'application/json')
                                .set('Authorization', auth.header)
                                .send();
        assert.strictEqual(status, 204);
    });

    it('Should get all users', async function() {
        const res = await request(app)
                            .get(`/user/getAll`)
                            .set('Authorization', auth.header)
                            .send();
        assert.deepStrictEqual(res.body, [user]);
    });

    it('Should get by email', async function() { 
        const res = await request(app)
                            .get(`/user/getByEmail?email=${user.email}`)
                            .send();
        assert.deepStrictEqual(res.body, user);
    });

    it('Should get by username', async function() {
        const res = await request(app)
                            .get(`/user/getByUsername?username=${user.username}`)
                            .send();
        assert.deepStrictEqual(res.body, user);
    });

    it('Should update', async function() { 
        user.avatarImage = 'newAvatar.png';
        const res = await request(app)
                            .put(`/user/update`)
                            .set('Accept', 'application/json')
                            .set('Authorization', auth.header)
                            .send({ user: user });
        assert.deepStrictEqual(res.body, user);
    });

    it('Should delete user by id', async function() {
        const res = await request(app)
                            .delete(`/user/deleteById?id=${user.id}`)
                            .set('Authorization', auth.header)
                            .send();
        await UserApi.deleteById(user.id);
        
        assert.strictEqual(res.status, 204);
    });
});