const { app } = require('./config/express');
const routes = require('./routes');

const { init } = require('./init');

init();

app.use('/role', routes.RoleRouter);
app.use('/user', routes.UserRouter);
app.use('/post', routes.PostRouter);
app.use('/project', routes.ProjectRouter);
app.use('/comment', routes.CommnetRouter);
app.use('/file', routes.FileRouter);
app.use('/like', routes.LikeRouter);
app.use('/tag', routes.TagRouter);
app.use('/directory', routes.DirectoryRouter);

module.exports = app;