const { express, passport } = require('../config/express');
const { ProjectController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'), ProjectController.create)
    .get('/getById', ProjectController.getById)
    .get('/getAll', ProjectController.getAll)
    .get('/getByUserId', ProjectController.getByUserId)
    .put('/update', passport.authenticate('local'), ProjectController.update)
    .delete('/deleteById', passport.authenticate('local'), ProjectController.deleteById);

module.exports = router;