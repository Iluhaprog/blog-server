const assert = require('assert');
const { response } = require('express');
const fs = require('fs');
const { FileManager } = require('../../src/libs/files/FileManager');

describe('Test lib for work with dropbox api', async function() {
    const mainDir = '/uploads';
    it('Should create directory file to dropbox', async function() {
        const dirname1 = '/testDirectory' + Date.now();
        try {
            await FileManager.createDir(dirname1, async (err, result, response) => {
                if (err) console.error(err);
                const { statusCode } = response;
                await FileManager.delete(dirname1);
                assert.strictEqual(statusCode, 200);
            });
        } catch (err) {
            console.error(err);
        }
    });
    it('Should upload file to dropbox', async function() {
        try {
            const readStream = fs.createReadStream(__dirname + '/../assets/file.txt');
            await FileManager.uploadFile(readStream, mainDir, 'txt', (err, result, responce, path) => {
                if (err) console.error(err);
                const { statusCode } = response;
                assert.strictEqual(statusCode, 200);
            });
        } catch (err) {
            console.error(err);
        }
    });
    it('Should download file to dropbox', async function() {
        try {
            const writeStream = fs.createWriteStream(__dirname + '/../assets/file2.txt');
            const readStream = fs.createReadStream(__dirname + '/../assets/file.txt');
            await FileManager.uploadFile(readStream, mainDir, 'txt', async (err, result, responce, filename) => {
                if (!err) {
                    await FileManager.downloadFile(writeStream, mainDir, filename, (err, result, responce) => {
                        if (err) console.error(err);
                        const { statusCode } = response;
                        assert.strictEqual(statusCode, 200);
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    });
    it('Should delete file to dropbox', async function() {
        try {
            const readStream = fs.createReadStream(__dirname + '/../assets/file.txt');
            await FileManager.uploadFile(readStream, mainDir, 'txt', async (err, result, responce, filename) => {
                if (!err) {
                    await FileManager.delete(main, filename, (err, result, response) => {
                        if (err) console.error(err);
                        const { statusCode } = response;
                        assert.strictEqual(statusCode, 200);
                    });
                }
            });
        } catch (err) {
            console.error(err);
        }
    });
    it('Should delete directory from dropbox if folder exists', async function() {
        const dirname2 = '/' + Date.now();
        try {
            await FileManager.createDir(dirname2, async (err, result, response) => {
                if (!err) {
                    await FileManager.delete(dirname2, '', (err, result, response) => {
                        if (err) console.error(err);
                        const { statusCode } = response;
                        assert.strictEqual(statusCode, 200);
                    });
                }
            });  
        } catch (err) {
            console.error(err);
        }
    });
});