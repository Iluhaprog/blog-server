const { express, passport } = require('../config/express');
const { CommentController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('basic'), CommentController.create)
    .get('/getById', CommentController.getById)
    .get('/getAll', CommentController.getAll)
    .get('/getByPostId', CommentController.getByPostId)
    .get('/getByUserId', CommentController.getByUserId)
    .put('/update', passport.authenticate('basic'), CommentController.update)
    .delete('/deleteById', passport.authenticate('basic'), CommentController.deleteById);

module.exports = router;