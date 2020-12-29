const assert = require('assert');

const { FileApi, PostApi, UserApi } = require('../../src/models');
const { postData, userData, fileData } = require('../initObjects');

describe('Test file api', async function() {
    const file = fileData;

    let postId = 0;

    it('Should create file', async function() {
        try {
            const user = await UserApi.create(userData);
            postData.userId = user.id;

            const post = await PostApi.create(postData);
            postId = post.id;
            file.postId = postId;
            
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

    it('Should get file by post id', async function() {
        try {
            const files = await FileApi.getByPostId(file.postId);
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
            await UserApi.deleteById(postData.userId);
            assert.deepStrictEqual(fileData, {});
        } catch (error) {
            console.error(error);
        }
    });
});