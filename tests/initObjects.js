const user = {
    avatarImage: '',
    firstName: 'Ilya',
    lastName: 'Novak',
    username: 'ilkass',
    bio: 'Bla bla bla!',
    email: 'email@email.email',
    password: '12345',
    confirmed: 0,
    skills: 'All',
    roleId: 0,
};

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

const auth = {
    row: 'username=email@email.email&password=12345',
    header: 'Basic ZW1haWxAZW1haWwuZW1haWw6MTIzNDU=',
    admin: 'Basic YWRtaW5AYWRtaW4uY29tOjEyMzQ1',
};

const testEmail = 'yoyef31841@izzum.com';

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