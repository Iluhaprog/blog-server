const { express, passport } = require('../config/express');
const { FileController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'), FileController.create)
    .get('/getById', FileController.getById)
    .get('/getByPostId', FileController.getByPostId)
    .put('/update', passport.authenticate('local'), FileController.update)
    .delete('/deleteById', passport.authenticate('local'), FileController.deleteById);

module.exports = router;