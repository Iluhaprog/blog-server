const { express } = require('../config/express');
const { CommentController } = require('../controllers');

const router = express.Router();

router
    .post('/create', CommentController.create)
    .get('/getById', CommentController.getById)
    .get('/getByPostId', CommentController.getByPostId)
    .get('/getByUserId', CommentController.getByUserId)
    .put('/update', CommentController.update)
    .delete('/deleteById', CommentController.deleteById);

module.exports = router;