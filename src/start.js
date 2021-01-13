const { port } = require('./config/express');
const app = require('./app');

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
