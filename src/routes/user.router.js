const { express } = require('../config/express');
const { UserController } = require('../controllers');

const router = express.Router();

router
    .get('/getById', UserController.getById)
    .get('/getByEmail', UserController.getByEmail)
    .get('/getByUsername', UserController.getByUsername)
    .post('/create', UserController.create)
    .put('/update', UserController.update)
    .delete('/deleteById', UserController.deleteById);

module.exports = router;