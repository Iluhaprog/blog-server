const { app, port } = require('./config/express');

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
