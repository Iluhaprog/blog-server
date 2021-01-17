const { express, passport } = require('../config/express');
const { CommentController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, CommentController.create)
    .get('/getById', CommentController.getById)
    .get('/getAll/:page/:limit', CommentController.getAll)
    .get('/getByPostId', CommentController.getByPostId)
    .get('/getByUserId', CommentController.getByUserId)
    .put('/update', auth.isAuthorized, CommentController.update)
    .delete('/deleteById', auth.isAuthorized, CommentController.deleteById);

module.exports = router;