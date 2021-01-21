const { express, passport } = require('../config/express');
const { PostController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', [auth.isAuthorized, access.isAdmin], PostController.create)
    .get('/getById', PostController.getById)
    .get('/getAll/:page/:limit', PostController.getAll)
    .get('/getCount', PostController.getCount)
    .get('/getByUserId', PostController.getByUserId)
    .put('/update', [auth.isAuthorized, access.isAdmin], PostController.update)
    .put('/setTags', [auth.isAuthorized, access.isAdmin], PostController.setTags)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], PostController.deleteById);

module.exports = router;