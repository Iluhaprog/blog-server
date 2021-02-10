const { DirectoryApi } = require('./models');

async function initDirs() {
    const avatarsDir = process.env.AVATARS_DIR;
    const previewsDir = process.env.PREVIEWS_DIR;
    const homeDir = process.env.HOME_DIR;
    
    await DirectoryApi.createInDropbox(avatarsDir, async () => {
        console.log('Init directories');
        await DirectoryApi.create(avatarsDir);
        console.log(`\t - ${avatarsDir} created`);
    });
    setTimeout(async () => {
        await DirectoryApi.createInDropbox(previewsDir, async () => {
            await DirectoryApi.create(previewsDir);
            console.log(`\t - ${previewsDir} created`);
        });
    }, 1000);
    setTimeout(async () => {
        await DirectoryApi.createInDropbox(homeDir, async () => {
            await DirectoryApi.create(homeDir);
            console.log(`\t - ${homeDir} created`);
        });
    }, 2000);
}

async function init() {
    console.log('Begin initialization:');
    await initDirs()
}

module.exports = {
    init
};