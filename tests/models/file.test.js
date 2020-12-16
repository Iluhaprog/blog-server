const assert = require('assert');
const { FileApi, PostApi, UserApi, RoleApi } = require('../../src/models/index');

describe('Test file api', async function() {
    const file = {
        name: 'main.png',
    };

    let postId = 0;
    let roleId = 0;

    it('Create file', async function() {
        const role = await RoleApi.create('User');

        const user = await UserApi.create({
            firstName: 'Ilya',
            lastName: 'Novak',
            username: 'ilyaNovak',
            email: 'rickmortyand4@gmail.com',
            bio: '',
            password: '123456',
            salt: '',
            roleId: role.id,
        });
        roleId = role.id;

        const post = await PostApi.create({
            title: 'My first project',
            description: 'I tell you about problems with wich i will face',
            preview: 'preview.png',
            text: 'bla bla bla',
            visible: false,
            userId: user.id,
        });
        postId = post.id;
        file.postId = postId;
        
        const newFile = await FileApi.create(file);
        file.id = newFile.id;
        file.date = newFile.date;

        assert.deepStrictEqual(newFile, file);
    });
    
    it('Get file by id', async function() {
        const fileData = await FileApi.getById(file.id);
        file.date = fileData.date;
        assert.deepStrictEqual(fileData, file);
    });

    it('Get file by post id', async function() {
        const files = await FileApi.getByPostId(file.postId);
        assert.deepStrictEqual(files, [file]);
    });
    
    it('Update file', async function() {
        file.name = 'NewMain.jpg';
        await FileApi.update(file);
        const fileData = await FileApi.getById(file.id);
        assert.deepStrictEqual(fileData, file);
    });

    it('Delete file by id', async function() {
        await FileApi.deleteById(file.id);

        const fileData = await FileApi.getById(file.id);
        await RoleApi.deleteById(roleId);
        assert.deepStrictEqual(fileData, {});
    });
});