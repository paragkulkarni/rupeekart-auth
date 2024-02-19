const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const cors = require('cors');
var cookieParser = require('cookie-parser');
const sessions = require('express-session');
const filestore = require("session-file-store")(sessions);
const oneDay = (24 * 60 * 60 * 1000);   // hrs * min * sec * one thousands millisecond
const uuid = require('uuid').v4; // generating random string

require("dotenv").config();





// Router
const userRouter = require("./routers/users.router");



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

// session create
app.use(sessions({
    genid: (req)=>{
        return uuid() //use uuid for sessionid
    },
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { 
        maxAge: oneDay, 
        secure: false,    // this is for production use https access only
        httpOnly: true   // true: means no access from javascript
    },
    resave: false,
    store: new filestore() 
}));



app.use('/com', userRouter);



app.get('/',(req, res) => {
    return res.send('Hello World! Session end!!<h1><a href="http://localhost:3000/users/login">Login</a></h1>');
});


app.listen(port,() => {
    console.log(`Server is on the port ${port}`);
});