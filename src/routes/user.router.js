const { express, passport } = require('../config/express');
const { UserController } = require('../controllers');

const router = express.Router();

router
    .post('/login', passport.authenticate('basic'), UserController.login)
    .post('/logout', passport.authenticate('basic'), UserController.logout)
    .get('/getById', UserController.getById)
    .get('/getAll', passport.authenticate('basic'), UserController.getAll)
    .get('/getByEmail', UserController.getByEmail)
    .get('/getByUsername', UserController.getByUsername)
    .post('/create', UserController.create)
    .put('/update', passport.authenticate('basic'), UserController.update)
    .delete('/deleteById', passport.authenticate('basic'), UserController.deleteById);

module.exports = router;