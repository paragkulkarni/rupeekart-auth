const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
var cookieParser = require('cookie-parser');
require("dotenv").config();





// Router
const userRouter = require('./routers/users.router');



const port = process.env.PORT || 3000;
const app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    // origin: 'http://www.rupeekart-tst.com'
    // origin: ['http://www.rupeekart-tst.com', 'https://google.com']
    // methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
    origin: '*'
}));
app.use(cookieParser());




app.use('/users', userRouter);



app.get('/',(req, res) => {
    res.send('Hello World!');
});


app.listen(port,() => {
    console.log(`Server is on the port ${port}`);
});