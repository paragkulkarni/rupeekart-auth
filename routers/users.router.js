const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuthMiddleware = require('../middleware/auth.middleware');
const User = db.user;


// Get users listing
router.get('/', function(req, res, next){
    res.send('response with a resourse');
});

router.post('/register', async (req, res, next)=>{
    console.log("********")
    // console.log(req)
    console.log("********")

    // const pwdHash = null;
    // const salt =  bcrypt.genSalt().then(salt => {
    //     bcrypt.hash(req.body.password, salt).then(hash=>{
    //         pwdHash = hash;
    //     });
    // });
    let pwdHash = null;
    // let user = null;

    const salt = await bcrypt.genSalt(10,async function(err, salt) {
        await bcrypt.hash(req.body.password, salt,async function(err, hash) {
            // Store hash in your password DB.
            const user = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: hash
            };
            const created_user = await User.create(user);
            console.log(created_user.toJSON())
          // save user token
            res.status(201).json({"success":1, "data": created_user.toJSON()});
        });       
    });
    
});


router.post('/login', async(req, res, next)=>{
    const user =await User.findOne({where: {
        email: req.body.email
    }});
    if(!user){
        return res.redirect('/');
    };
    req.isAuth = true;
    let password_valid = await bcrypt.compare(req.body.password, user.dataValues.password);
    if(password_valid){
        const token = jwt.sign({
                                "id": user.dataValues.id,
                                "email": user.dataValues.email,
                                "first_name": user.dataValues.first_name
                            }, process.env.SECRET);
        // res.status(200).json({token: token});
        // res.cookie("access_token", token, { httpOnly: true }).redirect('/users/me');
        return res.status(200).send({
            success: 'ok',
            token: token,
            userinfo: {
                "id": user.dataValues.id,
                "email": user.dataValues.email,
                "first_name": user.dataValues.first_name
            }
        });
    } else {
        return res.status(400).json({
            error: "Password INcorrect"
        });
    }
});


router.get('/me', isAuthMiddleware,
    async(req,res,next)=>{
        if(!req.session && !req.cookies.access_token){
            return res.status(404).json({'msg':"User not found"});
        }
        next();
        // let user = await User.findOne({where:{id : req.session.user.id},attributes:{exclude:["password"]}});
        //   return res.status(200).json({'user': user,'session': req.session});
    },
    async(req,res,next)=>{
        try {
            let token = req.cookies.access_token;
            let decoded = jwt.verify(token,process.env.SECRET);
            if(decoded){
                return res.send("This is homepage");
            };    
        } catch(err){
            return res.status(401).json({"msg":"Couldn't Authenticate Homepage"});
        }
    }
); 


router.get('/logout', isAuthMiddleware ,async (req, res, next)=>{

    let token = req.cookies.access_token;
    if(!token){
        return res.send("Token is not valid.");
    }
    let decoded = jwt.verify(token,process.env.SECRET);
    if(!decoded){
        return res.send("Token is not valid.");
    };
    req.session.destroy();
    return res.clearCookie("access_token").redirect('/users/login');
});


router.get('/login', (req, res, next)=>{
    res.send("Login Page")
});


module.exports = router;