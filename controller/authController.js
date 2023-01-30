const crypto =  require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const ansycHandler = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

//Global Functions (Reuseable)
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
};

const createSendToken = (user, statusCode, res) => {
    const access_token = signToken(user._id) 
        //test cookies by signing up
    const cookiesOptions = { expire: new Date( Date.now + Number(process.env.COOKIES_JWT_EXPIRES) * 24 * 60 * 60 * 1000), httpOnly: true}

    //check if production
    if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

    //Sending Cookies to the browser
    res.cookie('jwt', access_token, cookiesOptions);

    // remove Password from data
    // user.password = undefined;
    
        res.status(statusCode).json({
        status: 'Success',
        access_token,
        data: {
            user
        },
    });
};

const isUserExist =  ansycHandler( async (email) => {
    const userEmail = await User.findOne({email});
    return userEmail;
});

//SignUp Function
const signup = ansycHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    //defensive coding to ensure one email one user.
    const isExist = isUserExist(newUser.email);
    if(isExist) {
        return next(new AppError('Email already registered', 400))
    }

    createSendToken(newUser, 201, res);
});

const login = ansycHandler( async (req, res, next)=> {
    const {email, password} = req.body;

    if (!email || !password ) {
       return next( new AppError('Please, provide an Email and Password', 400));
    }

    const user = await User.findOne({email}).select('+password');
    
    if (!user || !( await user.matchPassword(password, user.password))){
        return next( new AppError('Invalid Email or Password entered.', 401));
    }

    createSendToken(user, 200, res)
}); 


const authenticate = ansycHandler( async (req, res, next) => {

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token = req.headers.authorization.split(' ')[1];
    }
    

    if (!token) {
       return next( new AppError('User is not logged in. Please login...', 401));
    }

    const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedToken.id);
    if (!currentUser) {
        return next(new AppError('The User with this token, no longer exists', 401));
    }

    if (currentUser.checkPasswordChange(decodedToken.iat)) {
        return new AppError('Password changed already... login again', 400);
    }

    req.user = currentUser;
    next();
 });

//Building Authorization
const grantAccessTo =  (...roles) => {    
 return  (req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return next( new AppError(`You don't have permission to perform this action,`, 403));
    };
    next();
};
};

//Forgot password and reset it
const forgotPassword = ansycHandler( async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if(!user){
        return next( new AppError('This user does not exist.', 404));
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false});

    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    //Send Email
    const message = `Hey, shey you forget password abi? oya click this link ${resetURL} make you reset am. Abeg if nor you apply to do this thing, freestyle this email`;
try {
    await sendEmail({
        email: user.email,
        subject: 'Reset Password <Token Valid for 10mins Only>',
        message
    });

    res.status(200).json({
        status: 'Success',
        message: 'Check your mail, a reset link has been sent to you'
    });
} catch(err) {

    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false});

    return next( new AppError('An Error occured sending the Email, try again', 500));
};
}); 


const resetPassword = ansycHandler( async (req, res, next) => {

    const hash =  crypto.createHash('sha256').update(req.params.token).digest('hex');

    // console.log(`Hashing token sent from client ${hash}`);
    const currentUser = await User.findOne({passwordResetToken: hash, passwordResetExpires: { $gt: Date.now() }});

    if (!currentUser) {
        return next( new AppError('Token is invalid or has expired.', 400));
    }

    currentUser.password = req.body.password;
    currentUser.passwordConfirm = req.body.password;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save();

    createSendToken(currentUser, 200, res)
});

const updatePassword = ansycHandler( async ( req, res, next ) => {
    //Find user by ID
    const user = await User.findById(req.user.id).select('+password');
    
    //Check if the current password is the same with that in DB
    if (! await user.matchPassword(req.body.currentPassword, user.password)) {
        next( new AppError('Your current password is not correct', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 201, res);
})

module.exports = {
    signup,
    login,
    authenticate,
    grantAccessTo,
    forgotPassword,
    resetPassword,
    updatePassword,
}
