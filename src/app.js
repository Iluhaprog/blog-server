const { app } = require('./config/express');
const { UserRouter } = require('./routes');

app.use('/user', UserRouter);

module.exports = app;