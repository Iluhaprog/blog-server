const { express } = require('../config/express');
const { ProjectController } = require('../controllers');

const router = express.Router();

router
    .post('/create', ProjectController.create)
    .get('/getById', ProjectController.getById)
    .get('/getAll', ProjectController.getAll)
    .get('/getByUserId', ProjectController.getByUserId)
    .put('/update', ProjectController.update)
    .delete('/deleteById', ProjectController.deleteById);

module.exports = router;