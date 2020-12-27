const { express, passport } = require('../config/express');
const { FileController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('basic'), FileController.create)
    .get('/getById', FileController.getById)
    .get('/getByPostId', FileController.getByPostId)
    .put('/update', passport.authenticate('basic'), FileController.update)
    .delete('/deleteById', passport.authenticate('basic'), FileController.deleteById);

module.exports = router;