const express = require('express');
const http = require('http');


const port = 5000;
const app = express();


app.get('/',(req, res) => {
    res.send('Hello World!');
});


app.listen(port,() => {
    console.log(`Server is on the port ${port}`);
});