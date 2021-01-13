const path = require('path');
const dropboxApiV2 = require('dropbox-v2-api');

function createDropbox() {
    return dropboxApiV2.authenticate({
        token: process.env.ACCESS_TOKEN,
    });
}

class FileManager {
 
    async uploadFile(stream, dirname, ext, cb = () => {}) {
        const filename = `${dirname}-${Date.now()}.${ext}`;
        const dropbox = createDropbox();
        const uploadStream = dropbox({
            resource: 'files/upload',
            parameters: {
                path: path.join(`/${dirname}`, filename),
            }
        }, (err, result, response) => cb(err, result, response, filename));
        stream.pipe(uploadStream);
    }

    async downloadFile(res, dirname, filename, cb = () => {}) {
        const dropbox = createDropbox();
        const downloadStream = dropbox({
            resource: 'files/download',
            parameters: {
                path: path.join('/' + dirname, filename),
            }
        }, cb);
        downloadStream.on('data', chunk => {
            res.write(chunk, 'binary');
        });
    }

    async createDir(dirname, cb = () => {}) {
        const dropbox = createDropbox();
        dropbox({
            resource: 'files/create_folder',
            parameters: {
                path: '/' + dirname,
            }
        }, cb);
    }

    async delete(dirname, filename = '', cb = () => {}) {
        const dropbox = createDropbox();
        dropbox({
            resource: 'files/delete',
            parameters: {
                path: path.join('/' + dirname, filename),
            }
        }, cb);
    }
}

module.exports = {
    FileManager: new FileManager()
}