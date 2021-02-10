const { express, passport } = require('../config/express');
const { HomeController } = require('../controllers');
const { uploader } = require('../libs/files');
const { auth, access } = require('../libs/filters');

const router = express.Router();

router
    .get('/get', HomeController.get)
    .put('/update', [auth.isAuthorized, access.isAdmin], HomeController.update)
    .put('/updatePreview', [auth.isAuthorized, access.isAdmin, uploader], HomeController.updatePreview)

module.exports = router;