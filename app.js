const express = require('express');
const http = require('http');
const morgan = require('morgan');


const port = 5000;
const app = express();


app.use(morgan('dev'));

app.get('/',(req, res) => {
    res.send('Hello World!');
});


app.listen(port,() => {
    console.log(`Server is on the port ${port}`);
});