require('dotenv').config();

const FOLLOWER = process.env.FOLLOWER;
const ADMIN = process.env.ADMIN;

function isFollower(req, res, next) {
    const user = getUser(req);
    if (user.withRole(FOLLOWER)) {
        next();
    } else {
        res.status(403).send();
    }
}

function isAdmin(req, res, next) {
    const user = getUser(req);
    if (user.withRole(ADMIN)) {
        next();
    } else {
        res.status(403).send();
    }
}

function withRole(value) {
    return this.roleId === value;
}

function getUser(req) {
    return {
        ...req.user,
        withRole,
    };
}

module.exports = {
    isFollower, 
    isAdmin,
};