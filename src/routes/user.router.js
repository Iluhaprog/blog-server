const { express, passport } = require('../config/express');
const { UserController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .post('/login', passport.authenticate('basic'), UserController.login)
    .post('/logout', auth.isAuthorized, UserController.logout)
    .get('/getById', UserController.getById)
    .get('/getAll', auth.isAuthorized, UserController.getAll)
    .get('/getByEmail', UserController.getByEmail)
    .get('/getByUsername', UserController.getByUsername)
    .post('/create', UserController.create)
    .put('/update', auth.isAuthorized, UserController.update)
    .delete('/remove', auth.isAuthorized, UserController.remove)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], UserController.deleteById);

module.exports = router;