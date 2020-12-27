const { express, passport } = require('../config/express');
const { ProjectController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('basic'), ProjectController.create)
    .get('/getById', ProjectController.getById)
    .get('/getAll', ProjectController.getAll)
    .get('/getByUserId', ProjectController.getByUserId)
    .put('/update', passport.authenticate('basic'), ProjectController.update)
    .delete('/deleteById', passport.authenticate('basic'), ProjectController.deleteById);

module.exports = router;