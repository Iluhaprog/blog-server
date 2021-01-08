const { express, passport } = require('../config/express');
const { FileController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', [auth.isAuthorized, access.isAdmin], FileController.create)
    .get('/getById', FileController.getById)
    .get('/getByPostId', FileController.getByPostId)
    .put('/update', [auth.isAuthorized, access.isAdmin], FileController.update)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], FileController.deleteById);

module.exports = router;