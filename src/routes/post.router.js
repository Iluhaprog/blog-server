const { express, passport } = require('../config/express');
const { PostController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, PostController.create)
    .get('/getById', PostController.getById)
    .get('/getAll', PostController.getAll)
    .get('/getByUserId', PostController.getByUserId)
    .put('/update', auth.isAuthorized, PostController.update)
    .put('/setTags', auth.isAuthorized, PostController.setTags)
    .delete('/deleteById', auth.isAuthorized, PostController.deleteById);

module.exports = router;