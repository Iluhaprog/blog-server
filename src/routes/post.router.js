const { express, passport } = require('../config/express');
const { PostController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'), PostController.create)
    .get('/getById', PostController.getById)
    .get('/getAll', PostController.getAll)
    .get('/getByUserId', PostController.getByUserId)
    .put('/update', passport.authenticate('local'), PostController.update)
    .put('/setTags', passport.authenticate('local'), PostController.setTags)
    .delete('/deleteById', passport.authenticate('local'), PostController.deleteById);

module.exports = router;