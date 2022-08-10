const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
        console.log("******** ------ ",err, salt, req.body.password)
        await bcrypt.hash(req.body.password, salt,async function(err, hash) {
            // Store hash in your password DB.
            console.log("&&&&&&& ",hash," %%%%%%%%%%%")
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


router.post('/auth', async(req, res, next)=>{
    console.log("MOdel --- ",User)
    const user =await User.findOne({where: {
        email: req.body.email
    }});
    console.log(user)
    if(user){
        let password_valid = await bcrypt.compare(req.body.password, user.dataValues.password);
        console.log("password_valid",password_valid)
        if(password_valid){
            console.log(process.env.SECRET)
            const token = jwt.sign({
                                    "id": user.dataValues.id,
                                    "email": user.dataValues.email,
                                    "first_name": user.dataValues.first_name
                                }, process.env.SECRET);
            res.status(200).json({token: token});
        } else {
            res.status(400).json({
                error: "PAssword INcorrect"
            });
        }
    } else {
        res.status(404).json({
            error: "user does not exist"
        });
    }
});

router.get('/me',
    async(req,res,next)=>{
        try {
            let token = req.headers['authorization'].split(" ")[1];
            let decoded = jwt.verify(token,process.env.SECRET);
            req.user = decoded;
            next();
        } catch(err){
            res.status(401).json({"msg":"Couldnt Authenticate"});
        }
    },
    async(req,res,next)=>{
      let user = await User.findOne({where:{id : req.user.id},attributes:{exclude:["password"]}});
      if(user === null){
        res.status(404).json({'msg':"User not found"});
      }
      res.status(200).json(user);
    }
); 




module.exports = router;