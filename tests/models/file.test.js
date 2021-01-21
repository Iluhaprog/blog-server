const assert = require('assert');

const { FileApi, PostApi, UserApi, DirectoryApi } = require('../../src/models');
const { postData, userData, fileData } = require('../initObjects');

describe('Test file api', async function() {
    const file = fileData;

    let postId = 0;

    it('Should create file', async function() {
        try {
            const dir = await DirectoryApi.create('dirname');
            file.directoryId = dir.id;
            
            const newFile = await FileApi.create(file);
            file.id = newFile.id;
            file.date = newFile.date;

            assert.deepStrictEqual(newFile, file);
        } catch (error) {
            console.error(error);
        }
    });
    
    it('Should get file by id', async function() {
        try {
            const fileData = await FileApi.getById(file.id);
            file.date = fileData.date;
            assert.deepStrictEqual(fileData, file);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should get files by directory id', async function() {
        try {
            const files = await FileApi.getByDirectoryId(file.directoryId);
            assert.deepStrictEqual(files, [file]);
        } catch (error) {
            console.error(error);
        }
    });
    
    it('Should update file', async function() {
        try {
            file.name = 'NewMain.jpg';
            await FileApi.update(file);
            const fileData = await FileApi.getById(file.id);
            assert.deepStrictEqual(fileData, file);
        } catch (error) {
            console.error(error);
        }
    });

    it('Should delete file by id', async function() {
        try {
            await FileApi.deleteById(file.id);

            const fileData = await FileApi.getById(file.id);
            await DirectoryApi.deleteById(file.directoryId);
            assert.deepStrictEqual(fileData, {});
        } catch (error) {
            console.error(error);
        }
    });
});