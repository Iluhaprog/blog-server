const { express, passport } = require('../config/express');
const { ProjectController } = require('../controllers');
const { auth, access } = require('../libs/filters');
const { uploader } = require('../libs/files')

const router = express.Router();

router
    .post('/create', [auth.isAuthorized, access.isAdmin], ProjectController.create)
    .get('/getById', ProjectController.getById)
    .get('/getCount', ProjectController.getCount)
    .get('/getAll/:page/:limit', ProjectController.getAll)
    .get('/getByUserId', ProjectController.getByUserId)
    .put('/update', [auth.isAuthorized, access.isAdmin], ProjectController.update)
    .put('/updatePreview', [auth.isAuthorized, access.isAdmin, uploader], ProjectController.updatePreview)
    .delete('/deleteById', [auth.isAuthorized, access.isAdmin], ProjectController.deleteById);

module.exports = router;