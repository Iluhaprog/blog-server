const { app } = require('./config/express');
const routes = require('./routes');

app.use('/role', routes.RoleRouter);
app.use('/user', routes.UserRouter);
app.use('/post', routes.PostRouter);
app.use('/project', routes.ProjectRouter);
app.use('/comment', routes.CommnetRouter);
app.use('/file', routes.FileRouter);
app.use('/like', routes.LikeRouter);
app.use('/tag', routes.TagRouter);

module.exports = app;