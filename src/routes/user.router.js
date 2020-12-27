const { express, passport } = require('../config/express');
const { UserController } = require('../controllers');

const router = express.Router();

router
    .post('/login', passport.authenticate('local'), UserController.login)
    .post('/logout', passport.authenticate('local'), UserController.logout)
    .get('/getById', UserController.getById)
    .get('/getAll', passport.authenticate('local'), UserController.getAll)
    .get('/getByEmail', UserController.getByEmail)
    .get('/getByUsername', UserController.getByUsername)
    .post('/create', UserController.create)
    .put('/update', passport.authenticate('local'), UserController.update)
    .delete('/deleteById', passport.authenticate('local'), UserController.deleteById);

module.exports = router;