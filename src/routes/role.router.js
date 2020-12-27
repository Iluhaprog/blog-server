const { express, passport } = require('../config/express');
const { RoleController } = require('../controllers');

const router = express.Router();

router
    .post('/create', passport.authenticate('basic'), RoleController.create)
    .get('/getById', passport.authenticate('basic'), RoleController.getById)
    .delete('/deleteById', passport.authenticate('basic'),RoleController.deleteById);

module.exports = router;