function isAuthorized(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.status(403).send();
    }
}

module.exports = {
    isAuthorized,
};