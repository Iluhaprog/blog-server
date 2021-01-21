const { express } = require('../config/express');
const { DirectoryController } = require('../controllers');

const router = express.Router();

router
    .get('/getById', DirectoryController.getById);


module.exports = router;