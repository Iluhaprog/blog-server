const { express, passport } = require('../config/express');
const { ProjectController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, ProjectController.create)
    .get('/getById', ProjectController.getById)
    .get('/getAll', ProjectController.getAll)
    .get('/getByUserId', ProjectController.getByUserId)
    .put('/update', auth.isAuthorized, ProjectController.update)
    .delete('/deleteById', auth.isAuthorized, ProjectController.deleteById);

module.exports = router;