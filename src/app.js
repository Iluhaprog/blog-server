const { app } = require('./config/express');
const routes = require('./routes');

app.use('/role', routes.RoleRouter);
app.use('/user', routes.UserRouter);
app.use('/post', routes.PostRouter);
app.use('/project', routes.ProjectRouter);
app.use('/comment', routes.CommnetRouter);

module.exports = app;