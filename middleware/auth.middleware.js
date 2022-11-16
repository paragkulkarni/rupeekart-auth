const jwt = require('jsonwebtoken');
require("dotenv").config();


const isAuthMiddleware = (req, res, next)=>{ 
    if(!req.session){
        res.status(400).send("User session end");
    }
   
    if(!req.cookies.access_token) res.status(400).send("Access denied. Token failed.");
    next();   
};


module.exports = isAuthMiddleware;