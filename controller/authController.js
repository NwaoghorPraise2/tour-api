const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const ansycHandler = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signup = ansycHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const access_token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    res.status(201).json({
        status: 'Success',
        message: 'User created successfully!',
        access_token,
        data: {
            user: newUser
        },
    });
 
});

const login = ansycHandler( async (req, res, next)=> {
    const {email, password} = req.body;

    if (!email || !password ) {
        next( new AppError('Please, provide an Email and Password', 400));
    }

    res.status(200).json({
        status:'Success',
        message: 'User Login'
    });
}); 



module.exports = {
    signup,
    login,
}
