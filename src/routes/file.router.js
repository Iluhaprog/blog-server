const { express, passport } = require('../config/express');
const { FileController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, FileController.create)
    .get('/getById', FileController.getById)
    .get('/getByPostId', FileController.getByPostId)
    .put('/update', auth.isAuthorized, FileController.update)
    .delete('/deleteById', auth.isAuthorized, FileController.deleteById);

module.exports = router;