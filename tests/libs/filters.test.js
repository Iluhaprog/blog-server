const session = require('supertest-session');
const assert = require('assert');
const app = require('../../src/app');
const { UserApi } = require('../../src/models');
const { auth, userData } = require('../initObjects');

describe('Test for middlewares', async function() {
    describe('Check isAuthorized middleware', async function() {
        var testSession = session(app, {
            befor: function(req) {
                req.set('authorization', auth.admin);
            }
        });
        it('Should get status 200', async function() {
            const { status } = await testSession
                                    .post('/user/login')
                                    .set('authorization', auth.admin)
                                    .send();
            await testSession.post('/user/logout').send();
            assert.strictEqual(status, 200);
        });
        it('Should get status 403', async function() {
            const { status } = await testSession
                                .post('/user/logout')
                                .send()
            assert.strictEqual(status, 403);
        })
    });
    describe('Check isAdmin middleware', async function() {
        const createSession = auth => session(app, {
            befor: function(req) {
                req.set('authorization', auth);
            }
        });
        const adminSession = createSession(auth.admin);
        const followerSessoin = createSession(auth.header);
        it('Should get status 200', async function() {
            const { status } = await adminSession
                                    .post('/user/login')
                                    .set('authorization', auth.admin)
                                    .send();
            await adminSession.post('/user/logout').send();
            assert.strictEqual(status, 200);
        });
        it('Should get status 403', async function() {
            const role = 'TEST_ROLE';
            const user = await UserApi.create(userData);
            await followerSessoin
                .post('/user/login')
                .set('authorization', auth.header)
                .send();
            const { status } = await followerSessoin
                        .post(`/role/create?role=${role}`)
                        .send();
            followerSessoin.post('/user/logout').send();
            await UserApi.deleteById(user.id);
            assert.strictEqual(status, 403);
        })
    });
});