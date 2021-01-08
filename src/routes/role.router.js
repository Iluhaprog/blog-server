const { express, passport } = require('../config/express');
const { RoleController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', [auth.isAuthorized, access.isAdmin], RoleController.create)
    .get('/getById', [auth.isAuthorized, access.isAdmin], RoleController.getById)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], RoleController.deleteById);

module.exports = router;