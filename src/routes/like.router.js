const { express, passport } = require('../config/express');
const { LikeController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, LikeController.create)
    .get('/getById', LikeController.getById)
    .get('/getAll', LikeController.getAll)
    .get('/getCount', LikeController.getCount)
    .get('/getByUserId', LikeController.getByUserId)
    .get('/getByPostId', LikeController.getByPostId)
    .delete('/deleteById', auth.isAuthorized, LikeController.deleteById);

module.exports = router;