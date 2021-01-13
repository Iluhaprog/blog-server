const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const { UserApi } = require('../models');
const crypt = require('../libs/crypt');

async function getUser(username) {
    if (username.includes('@')) {
        return await UserApi.getByEmail(username);
    }
    return await UserApi.getByUsername(username);
}

const isEmpty = obj => {
    for (let key in obj) {
        return false;
    }
    return true;
}

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await UserApi.getById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

passport.use(new BasicStrategy(
    async function(username, password, done) {
        try {
            const user = await getUser(username);
            if (isEmpty(user)) {
                return done(null, false);
            }
            if (!crypt.compare(password, user.password)) {
                return done(null, false);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

module.exports = passport;