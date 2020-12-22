const { express } = require('../config/express');
const { LikeController } = require('../controllers');

const router = express.Router();

router
    .post('/create', LikeController.create)
    .get('/getById', LikeController.getById)
    .get('/getByUserId', LikeController.getByUserId)
    .get('/getByPostId', LikeController.getByPostId)
    .delete('/deleteById', LikeController.deleteById);

module.exports = router;