const jwt = require('jsonwebtoken');


const isAuthMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(authHeader){
        jwt.verify(authHeader, process.env.SECRET, (err, user) => {
            if (err) {
                res.writeHead( 400, 'Current password does not match', {'content-type' : 'text/plain'});
                res.end( 'Current value does not match');
                return;
            }
            req.user = user;
            next();
        });
    } else {
        return res.sendStatus(404);
    }
    next();
};


module.exports = isAuthMiddleware;