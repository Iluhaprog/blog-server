const { app } = require('./config/express');
const { UserRouter, RoleRouter, PostRouter, ProjectRouter } = require('./routes');

app.use('/role', RoleRouter);
app.use('/user', UserRouter);
app.use('/post', PostRouter);
app.use('/project', ProjectRouter);

module.exports = app;