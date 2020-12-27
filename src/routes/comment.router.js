const { express, passport } = require('../config/express');
const { CommentController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'), CommentController.create)
    .get('/getById', CommentController.getById)
    .get('/getAll', CommentController.getAll)
    .get('/getByPostId', CommentController.getByPostId)
    .get('/getByUserId', CommentController.getByUserId)
    .put('/update', passport.authenticate('local'), CommentController.update)
    .delete('/deleteById', passport.authenticate('local'), CommentController.deleteById);

module.exports = router;