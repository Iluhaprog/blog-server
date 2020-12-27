const { express, passport } = require('../config/express');
const { TagController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'),TagController.create)
    .get('/getById', TagController.getById)
    .get('/getByPostId', TagController.getByPostId)
    .delete('/deleteById', passport.authenticate('local'), TagController.deleteById);

module.exports = router;