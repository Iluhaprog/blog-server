require('dotenv').config();

const ADMIN = process.env.ADMIN;

function isAdmin(req, res, next) {
    const user = getUser(req);
    if (user.withRole(ADMIN)) {
        next();
    } else {
        res.status(403).send();
    }
}

function withRole(value) {
    return +this.roleId === +value;
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