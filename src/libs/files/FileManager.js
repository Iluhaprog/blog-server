const { response } = require('express');
const path = require('path');
const { dropbox } = require('../../config/express');

class FileManager {
 
    async uploadFile(req, dirname, ext, cb = () => {}) {
        const filename = `${dirname}-${Date.now()}.${ext}`;
        const uploadStream = dropbox({
            resource: 'files/upload',
            parameters: {
                path: path.join(dirname, filename),
            }
        }, (err, result, response) => cb(err, result, response, filename));
        req.pipe(uploadStream);
    }

    async downloadFile(res, dirname, filename, cb = () => {}) {
        const downloadStream = dropbox({
            resource: 'files/download',
            parameters: {
                path: path.join(dirname, filename),
            }
        }, cb);
        downloadStream.on('data', chunk => {
            res.write(chunk, 'binary');
        });
    }

    async createDir(dirname, cb = () => {}) {
        dropbox({
            resource: 'files/create_folder',
            parameters: {
                path: dirname,
            }
        }, cb);
    }

    async delete(dirname, filename = '', cb = () => {}) {
        dropbox({
            resource: 'files/delete',
            parameters: {
                path: path.join(dirname, filename),
            }
        }, cb);
    }
}

module.exports = {
    FileManager: new FileManager()
}