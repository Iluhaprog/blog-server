const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi } = require('../../src/models');
const { userData, auth } = require('../initObjects');

describe('Test for user api of app', async function() {
    const user = userData;

    var testSession = session(app, {
        befor: function(req) {
            req.set('authorization', auth.header);
        }
    });
    const admin = await session(app, {
        befor: function(req) {
            req.set('authorization', auth.admin);
        }
    });

    it('Should create user', async function() {
        const res = await testSession
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
        const res = await testSession
                            .get(`/user/getById?id=${user.id}`)
                            .send();
        user.date = res.body.date;
        assert.deepStrictEqual(res.body, user);
    });

    it('Should login user', async function() {
        const { body, status } = await testSession
                    .post('/user/login')
                    .set('authorization', auth.header)
                    .send();
        assert.strictEqual(status, 200);
        assert.deepStrictEqual(body, user);
    });

    it('Should get all users', async function() {
        const { body } = await testSession
                            .get(`/user/getAll`)
                            .send();
        assert.deepStrictEqual(Array.isArray(body), true);
    });

    it('Should get by email', async function() { 
        const res = await testSession
                            .get(`/user/getByEmail?email=${user.email}`)
                            .send();
        assert.deepStrictEqual(res.body, user);
    });

    it('Should get by username', async function() {
        const res = await testSession
                            .get(`/user/getByUsername?username=${user.username}`)
                            .send();
        assert.deepStrictEqual(res.body, user);
    });

    it('Should update', async function() { 
        user.avatarImage = 'newAvatar.png';
        const res = await testSession
                            .put(`/user/update`)
                            .set('Accept', 'application/json')
                            .send({ user: user });
        assert.deepStrictEqual(res.body, user);
    });

    it('Should delete user by id', async function() {
        const res = await admin
                            .delete(`/user/deleteById?id=${user.id}`)
                            .send();
        await UserApi.deleteById(user.id);
        
        assert.strictEqual(res.status, 204);
    });

    it('Should logout user', async function() {
        const { status } = await testSession
                                .post(`/user/logout?${auth.row}`)
                                .send();
        assert.strictEqual(status, 204);
    });
});