const { express, passport } = require('../config/express');
const { PostController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('basic'), PostController.create)
    .get('/getById', PostController.getById)
    .get('/getAll', PostController.getAll)
    .get('/getByUserId', PostController.getByUserId)
    .put('/update', passport.authenticate('basic'), PostController.update)
    .put('/setTags', passport.authenticate('basic'), PostController.setTags)
    .delete('/deleteById', passport.authenticate('basic'), PostController.deleteById);

module.exports = router;