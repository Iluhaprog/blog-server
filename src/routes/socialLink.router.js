const { express, passport } = require('../config/express');
const { SocialLinkController } = require('../controllers');
const { auth, access } = require('../libs/filters');
const { uploader } = require('../libs/files')

const router = express.Router();

router
    .post('/create', [auth.isAuthorized], SocialLinkController.create)
    .get('/getById', SocialLinkController.getById)
    .get('/getByUserId', SocialLinkController.getByUserId)
    .put('/update', [auth.isAuthorized], SocialLinkController.update)
    .put('/updatePreview', [auth.isAuthorized, uploader], SocialLinkController.updatePreview)
    .delete('/deleteById', [auth.isAuthorized], SocialLinkController.deleteById);

module.exports = router;