const { express, passport } = require('../config/express');
const { ProjectController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', [auth.isAuthorized, access.isAdmin], ProjectController.create)
    .get('/getById', ProjectController.getById)
    .get('/getCount', ProjectController.getCount)
    .get('/getAll/:page/:limit', ProjectController.getAll)
    .get('/getByUserId', ProjectController.getByUserId)
    .put('/update', [auth.isAuthorized, access.isAdmin], ProjectController.update)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], ProjectController.deleteById);

module.exports = router;