const { express, passport } = require('../config/express');
const { RoleController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('local'), RoleController.create)
    .get('/getById', passport.authenticate('local'), RoleController.getById)
    .delete('/deleteById', passport.authenticate('local'),RoleController.deleteById);

module.exports = router;