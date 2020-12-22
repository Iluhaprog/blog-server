const { express } = require('../config/express');
const { RoleController } = require('../controllers');

const router = express.Router();

router
    .post('/create', RoleController.create)
    .get('/getById', RoleController.getById)
    .delete('/deleteById', RoleController.deleteById);

module.exports = router;