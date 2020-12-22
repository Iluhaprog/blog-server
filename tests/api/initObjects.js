const user = {
    avatarImage: '',
    firstName: 'Ilya',
    lastName: 'Novak',
    username: 'ilkass',
    bio: 'Bla bla bla!',
    email: 'email@email.email',
    password: '12345',
    skills: 'All',
    roleId: 0,
};

const post = {
    title: 'My first project',
    description: 'I tell you about problems with wich i will face',
    preview: 'preview.png',
    text: 'bla bla bla',
    visible: false,
};

const project = {
    preview: 'project_preview.png',
    title: 'Chat',
    description: 'Chat for people',
    projectLink: 'https://chat.com',
    githubLink: 'https://github.com',
};

module.exports = {
    userData: user,
    postData: post,
    projectData: project,
};