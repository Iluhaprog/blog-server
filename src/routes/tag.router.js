const { express } = require('../config/express');
const { TagController } = require('../controllers');

const router = express.Router();

router
    .post('/create', TagController.create)
    .get('/getById', TagController.getById)
    .get('/getByPostId', TagController.getByPostId)
    .delete('/deleteById', TagController.deleteById);

module.exports = router;