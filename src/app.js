const { app, port } = require('./config/express');

app.get('/', (req, res) => {
    res.send('test');
});

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});