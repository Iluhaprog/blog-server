const assert = require('assert');

const { ProjectApi, UserApi, RoleApi } = require('../../src/models');
const { projectData, userData } = require('../initObjects');

describe('Test project api', async function() {
    const project = projectData;
    let roleId = 0;

    it('Should create project', async function() {
        try {
            const role = await RoleApi.create('User');
            userData.roleId = role.id;

            const user = await UserApi.create(userData);
            roleId = role.id;
            project.userId = user.id;

            const newProject = await ProjectApi.create(project);
            project.id = newProject.id;
            assert.deepStrictEqual(newProject, project);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should get project by id', async function() {
        try {
            const projectData = await ProjectApi.getById(project.id);
            assert.deepStrictEqual(projectData, project);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should get project by user id', async function() {
        try {
            const projectData = await ProjectApi.getByUserId(project.userId);
            assert.deepStrictEqual(projectData, [project]);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should update project', async function() {
        try {
            project.preview = 'newPreview.png';
            project.title = 'NewChat';
            await ProjectApi.update(project);
            const projectData = await ProjectApi.getById(project.id);
            assert.deepStrictEqual(projectData, project);
        } catch(error) {
            console.error(error);
        }
    });

    it('Should delete project by id', async function() {
        try {
            await ProjectApi.deleteById(project.id);
            const projectData = await ProjectApi.getById(project.id);
            await RoleApi.deleteById(roleId);
            assert.deepStrictEqual(projectData, {});
        } catch(error) {
            console.error(error);
        }
    });    
});