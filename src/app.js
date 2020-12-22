const { app } = require('./config/express');
const { UserRouter, RoleRouter } = require('./routes');

app.use('/role', RoleRouter);
app.use('/user', UserRouter);

module.exports = app;