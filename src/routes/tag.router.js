const { express, passport } = require('../config/express');
const { TagController } = require('../controllers');
const { auth } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', auth.isAuthorized, TagController.create)
    .get('/getById', TagController.getById)
    .get('/getByPostId', TagController.getByPostId)
    .delete('/deleteById', auth.isAuthorized, TagController.deleteById);

module.exports = router;