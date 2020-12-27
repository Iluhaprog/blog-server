const { express, passport } = require('../config/express');
const { LikeController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'), LikeController.create)
    .get('/getById', LikeController.getById)
    .get('/getAll', LikeController.getAll)
    .get('/getByUserId', LikeController.getByUserId)
    .get('/getByPostId', LikeController.getByPostId)
    .delete('/deleteById', passport.authenticate('local'), LikeController.deleteById);

module.exports = router;