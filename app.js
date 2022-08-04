const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const cors = require('cors');



const port = 5000;
const app = express();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded());
app.use(cors({
    // origin: 'http://www.rupeekart-tst.com'
    // origin: ['http://www.rupeekart-tst.com', 'https://google.com']
    // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    origin: '*'
}));



app.get('/',(req, res) => {
    res.send('Hello World!');
});


app.listen(port,() => {
    console.log(`Server is on the port ${port}`);
});