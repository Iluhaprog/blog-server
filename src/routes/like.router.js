const { express, passport } = require('../config/express');
const { LikeController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('basic'), LikeController.create)
    .get('/getById', LikeController.getById)
    .get('/getAll', LikeController.getAll)
    .get('/getByUserId', LikeController.getByUserId)
    .get('/getByPostId', LikeController.getByPostId)
    .delete('/deleteById', passport.authenticate('basic'), LikeController.deleteById);

module.exports = router;