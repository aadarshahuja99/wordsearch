// express tutorial
const express = require('express');
const app = express();
const { router } = require('./api');

app.use(express.json());

app.use('/api/v1/words', router);

app.get('/', (req, res) => {
    res.status(200).send('Hey there');
});

app.listen(3000, () => {
    console.log('server is listening on port 3000');
});
