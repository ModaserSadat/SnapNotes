const express = require('express')
const bcrypt = require('bcrypt');  //A library to help you hash passwords.
var jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');

JWT_SECRET = 'modaserisagoode@boy';

//Create a User using: POST "/api/auth/createuser"
router.post('/createuser', 
body('name').isLength({min:3}).withMessage('name should be at least 3 chars'),
body('email').isEmail().withMessage('Not a valid e-mail address'),
body('password').isLength({min:8}).withMessage('Password should be at least 8 chars'),
async (req, res) => {
    const result = validationResult(req);
    //if there are errors return bad request and errors
    if (!result.isEmpty()) {
        return res.status(400).res.json({ errors: result.array() }); 
    }
    try {
    //check whether a user with this email already exists
    let user = await User.findOne({email: req.body.email});
    if (user){
        return res.status(400).json({error: "A User with this Email already exists"})
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = await User.create ({                         //Create() returns a promise
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })

    data = {
        user: {
            id: user.id
        }  
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json(authtoken);
    
    } catch(error) {
        console.error(error.message);
        res.status(500).send("Some Error occured;")
    }

    
})

module.exports = router