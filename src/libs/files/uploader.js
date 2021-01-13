const { FileManager } = require('./FileManager');
const { Form } = require('multiparty');

function getFileExtention(filename) {
    return filename.split('.')[1];
}

async function uploader(req, res, next) {
    const { dirname } = req.query;
    const form = new Form();
    form.on('error', error => res.status(500).send(error));
    form.on('part', async part => {
        if (part.filename) {
            const ext = getFileExtention(part.filename);
            await FileManager.uploadFile(part, dirname, ext, async (err, result, response, pathname) => {
                if (err) {
                    console.log(err);
                }
                req.file = { filename: part.filename, pathname, dirname };
                next();
            });
        }
    });
    form.parse(req);
}

module.exports = {
    uploader,
}