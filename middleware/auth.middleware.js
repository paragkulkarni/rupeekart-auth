const isAuthMiddleware = (req, res, next)=>{
    console.log("1:isAuthMiddleware",req.session)
    if(req.session.isAuth==true){
        next();
    } else {
        console.log("2:isAuthMiddleware",req.session)

        res.redirect('/users/login');
    }
    console.log("3:isAuthMiddleware")
    
};


module.exports = isAuthMiddleware;