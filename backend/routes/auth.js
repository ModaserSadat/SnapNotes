const express = require('express')
const bcrypt = require('bcrypt');  //A library to help you hash passwords.
var jwt = require('jsonwebtoken');
//User modal of mongoDB
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchUser')

JWT_SECRET = 'modaserisagoode@boy';

//Route 1: Create a User using: POST "/api/auth/createuser"
router.post('/createuser',
    body('name').isLength({ min: 3 }).withMessage('name should be at least 3 chars'),
    body('email').isEmail().withMessage('Not a valid e-mail address'),
    body('password').isLength({ min: 8 }).withMessage('Password should be at least 8 chars'),
    async (req, res) => {
        const result = validationResult(req);
        //if there are errors return bad request and errors
        if (!result.isEmpty()) {
            return res.status(400).res.json({ errors: result.array() });
        }
        try {
            //check whether a user with this email already exists
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ error: "A User with this Email already exists" })
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            user = await User.create({                         //Create() returns a promise
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })

            let data = {
                user: {
                    id: user.id
                }
            }
            // console.log(data);
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json(authtoken);

        } catch (error) {
            console.error(error.message);
            res.status(500).send("Some Error occured;")
        }


    })


//Route 2: Post request for login ./api/auth/login
router.post('/login',
    body('email').isEmail().withMessage('Email not valid'),
    body('password').isLength({ min: 8 }).withMessage('Password should be at least 8 characters'),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ error: result.array() });
        }
        try {
            //find user exist or not
            let user = await User.findOne({ email: req.body.email });
            //if user not exist than return status 400
            if (!user) {
                return res.status(400).json({ error: 'User not exists' });
            }

            
            //if user exist than compare password
            //password comes from the user
            //user.password comes from the database
            const { email, password } = req.body;
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (isPasswordMatched) {
                let data = {
                    user: {
                        id: user.id
                    }
                }
                const authtoken = jwt.sign(data, JWT_SECRET);
                res.json(authtoken);

            }
            else {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
)

//Router 3: Get loggedin User details Using POST '/api/auth/getuser/
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user =await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})


module.exports = router