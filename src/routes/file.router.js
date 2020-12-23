const { express } = require('../config/express');
const { FileController } = require('../controllers');

const router = express.Router();

router
    .post('/create', FileController.create)
    .get('/getById', FileController.getById)
    .get('/getByPostId', FileController.getByPostId)
    .put('/update', FileController.update)
    .delete('/deleteById', FileController.deleteById);

module.exports = router;