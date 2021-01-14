
const confirm = {
    code: 'HASH',
};

const post = {
    title: 'My first project',
    description: 'I tell you about problems with wich i will face',
    preview: 'preview.png',
    text: 'bla bla bla',
    visible: false,
    dirname: 'my_first_project',
};

const project = {
    preview: 'project_preview.png',
    title: 'Chat',
    description: 'Chat for people',
    projectLink: 'https://chat.com',
    githubLink: 'https://github.com',
};

const comment = {
    text: 'Cool post',
};

const file = {
    name: 'image.png',
    path: '',
};

const tag = {
    title: 'React',
};

const toBase64 = data => {
    let buff = new Buffer(data);
    return buff.toString('base64');
}


const testEmail = 'hohoya6537@izzum.com';

const user = {
    avatarImage: '',
    firstName: 'Ilya',
    lastName: 'Novak',
    username: 'ilkass',
    bio: 'Bla bla bla!',
    email: testEmail,
    password: '12345',
    confirmed: 0,
    skills: 'All',
    roleId: 0,
};

const auth = {
    header: `Basic ${toBase64(`${user.email}:${user.password}`)}`,
    admin: 'Basic YWRtaW5AYWRtaW4uY29tOjEyMzQ1',
};

module.exports = {
    userData: user,
    postData: post,
    projectData: project,
    commentData: comment,
    fileData: file,
    tagData: tag,
    confirmData: confirm,
    testEmail,
    auth,
};