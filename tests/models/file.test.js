const assert = require('assert');

const { FileApi, PostApi, UserApi, RoleApi } = require('../../src/models');
const { post: postData, user: userData, file: fileData } = require('./initObjects');

describe('Test file api', async function() {
    const file = fileData;

    let postId = 0;
    let roleId = 0;

    it('Should create file', async function() {
        try {
            const role = await RoleApi.create('User');
            userData.roleId = role.id;

            const user = await UserApi.create(userData);
            roleId = role.id;
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
            await RoleApi.deleteById(roleId);
            assert.deepStrictEqual(fileData, {});
        } catch (error) {
            console.error(error);
        }
    });
});