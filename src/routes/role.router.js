const { express, passport } = require('../config/express');
const { RoleController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, RoleController.create)
    .get('/getById', auth.isAuthorized, RoleController.getById)
    .delete('/deleteById', auth.isAuthorized, RoleController.deleteById);

module.exports = router;