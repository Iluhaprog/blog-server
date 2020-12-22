const { app } = require('./config/express');
const { UserRouter, RoleRouter, PostRouter } = require('./routes');

app.use('/role', RoleRouter);
app.use('/user', UserRouter);
app.use('/post', PostRouter);

module.exports = app;