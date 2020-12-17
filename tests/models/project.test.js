const assert = require('assert');
const { ProjectApi, UserApi, RoleApi } = require('../../src/models/index');

describe('Test project api', async function() {
    const project = {
        preview: 'project_preview.png',
        title: 'Chat',
        description: 'Chat for people',
        projectLink: 'https://chat.com',
        githubLink: 'https://github.com',
    };
    let roleId = 0;


    it('Create project', async function() {
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
        project.userId = user.id;

        const newProject = await ProjectApi.create(project);
        project.id = newProject.id;
        assert.deepStrictEqual(newProject, project);
    });

    it('Get project by id', async function() {
        const projectData = await ProjectApi.getById(project.id);
        assert.deepStrictEqual(projectData, project);
    });

    it('Get project by user id', async function() {
        const projectData = await ProjectApi.getByUserId(project.userId);
        assert.deepStrictEqual(projectData, [project]);
    });

    it('Update project', async function() {
        project.preview = 'newPreview.png';
        project.title = 'NewChat';
        await ProjectApi.update(project);
        const projectData = await ProjectApi.getById(project.id);
        assert.deepStrictEqual(projectData, project);
    });

    it('Delete project by id', async function() {
        await ProjectApi.deleteById(project.id);
        const projectData = await ProjectApi.getById(project.id);
        await RoleApi.deleteById(roleId);
        assert.deepStrictEqual(projectData, {});
    });    
});