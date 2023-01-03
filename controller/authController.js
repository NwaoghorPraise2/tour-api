const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const ansycHandler = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
};

const signup = ansycHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const access_token = signToken(newUser._id) 
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
       return next( new AppError('Please, provide an Email and Password', 400));
    }

    const user = await User.findOne({email}).select('+password');

    if (!user || !(await user.matchPassword(password, user.password))){
        return next( new AppError('Invalid Email or Password entered.', 401));
    }

    const access_token = signToken(user.id);

    res.status(200).json({
        status:'Success',
        message: 'User Login',
        access_token,
    });
}); 



module.exports = {
    signup,
    login,
}
