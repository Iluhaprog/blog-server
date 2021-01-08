const { express, passport } = require('../config/express');
const { TagController } = require('../controllers');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .post('/create', [auth.isAuthorized, access.isAdmin], TagController.create)
    .get('/getById', TagController.getById)
    .get('/getByPostId', TagController.getByPostId)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], TagController.deleteById);

module.exports = router;