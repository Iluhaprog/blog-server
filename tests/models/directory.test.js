const assert = require('assert');
const { DirectoryApi } = require('../../src/models');

describe('Test directory api', async () => {
    const dir = { name: 'dirname' };

    it('Should create directory', async () => {
        const newDir = await DirectoryApi.create(dir.name);
        dir.id = newDir.id;
        assert.deepStrictEqual(newDir, dir);
    });

    it('Should create directory in dropbox', async () => {
        await DirectoryApi.createInDropbox(dir.name, () => {
            assert.strictEqual(1, 1);
        });
    });

    it('Should get directory by id', async () => {
        const dirData = await DirectoryApi.getById(dir.id);
        assert.deepStrictEqual(dirData, dir);
    });

    it('Should get directory by name', async () => {
        const dirData = await DirectoryApi.getByName(dir.name);
        assert.deepStrictEqual(dirData, dir);
    });

    it('Should delete directory by id', async () => {
        await DirectoryApi.deleteById(dir.id);
        const dirData = await DirectoryApi.getByName(dir.name);
        assert.deepStrictEqual(dirData, {});
    });

    it('Should delete directory by name in dropbox', async () => {
        setTimeout(async () => { 
            await DirectoryApi.deleteInDropbox(dir.name, () => {
                assert.strictEqual(1, 1);
            });
        }, 2000);
    });
});