const { Role } = require('./model');
const api = require('./api');

(async () => {
    await Role.sync({ alter: true });
});

module.exports = {
    RoleApi: api,
};