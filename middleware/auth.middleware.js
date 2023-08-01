const isAuthMiddleware = (req, res, next)=>{
    console.log("1:isAuthMiddleware",req.cookies)
     
    if(req && req.headers.Authorization){
        console.log(req.headers.Authorization)
        next();
    } else {
        console.log("2:isAuthMiddleware",req.session)

        res.redirect('/users/login');
    }
    console.log("3:isAuthMiddleware")
    
};


module.exports = isAuthMiddleware;