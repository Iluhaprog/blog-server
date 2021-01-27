const { express, passport } = require('../config/express');
const { UserController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

const authenticate = (req, res, next) => {
    passport.authenticate('basic', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(403).json(info);
        req.logIn(user, err => {
            if (err) return next(err);
            next()
        });
    })(req, res, next);
};

router
    .post('/login', authenticate, UserController.login)
    .post('/logout', auth.isAuthorized, UserController.logout)
    .get('/getById', UserController.getById)
    .get('/getAll', auth.isAuthorized, UserController.getAll)
    .get('/getByEmail', UserController.getByEmail)
    .get('/getByUsername', UserController.getByUsername)
    .post('/create', UserController.create)
    .get('/verify/:code', UserController.verify)
    .put('/update', auth.isAuthorized, UserController.update)
    .delete('/remove', auth.isAuthorized, UserController.remove)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], UserController.deleteById);

module.exports = router;