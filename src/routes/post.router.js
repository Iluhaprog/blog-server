const { express } = require('../config/express');
const { PostController } = require('../controllers');

const router = express.Router();

router
    .post('/create', PostController.create)
    .get('/getById', PostController.getById)
    .get('/getAll', PostController.getAll)
    .get('/getByUserId', PostController.getByUserId)
    .put('/update', PostController.update)
    .put('/setTags', PostController.setTags)
    .delete('/deleteById', PostController.deleteById);

module.exports = router;