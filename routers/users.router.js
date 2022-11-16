const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const isAuthMiddleware = require('../middleware/auth.middleware');
const User = db.user;
const axios = require('axios');


require("dotenv").config();

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
    let password_valid = await bcrypt.compare(req.body.password, user.dataValues.password);
    if(password_valid){
        const token = jwt.sign({
                                "id": user.dataValues.id,
                                "email": user.dataValues.email,
                                "first_name": user.dataValues.first_name
                            }, process.env.SECRET,{expiresIn:'10m'});
        req.session.token = token;
        return res.cookie("access_token", token, { httpOnly: true }).redirect('/users/me');         
    } else {
        return res.status(200).send({
            error: "Password Incorrect"
        });
    }
});


router.get('/me', isAuthMiddleware,
    async(req,res,next)=>{
        const session = req.session;
        try {
            if(!session&!session.token){
                return res.redirect('users/login')
            } else {
                const decoded = jwt.verify(session.token,process.env.SECRET);
                return res.status(200).json({
                    'success': true,
                    'user' : decoded
                });   
            }
        } catch(err){
            return res.status(400).send("Couldn't Authenticate Homepage");
        }
    }
); 


router.get('/logout', isAuthMiddleware ,async (req, res, next)=>{
    req.session.destroy((err) => {
        console.log("error after session destroy - ", err)
        res.status(200).redirect('/users/login'); // this will always fire after session is destroyed
    });
    
});


router.get('/login', (req, res, next)=>{
    res.send("Login Page")
});


module.exports = router;