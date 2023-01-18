const crypto =  require('crypto');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const ansycHandler = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/sendEmail');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
};

const signup = ansycHandler(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role, //Remeber to remove it
        // passwordChangedAt: req.body.passwordChangedAt,//Remeber to remove it.
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

    console.log(`Hashing token sent from client ${hash}`);

    const currentUser = await User.findOne({passwordResetToken: hash});

    console.log(Date.now());

    console.log(currentUser);
    
    if (!currentUser) {
        return next( new AppError('Token is invalid or has expired.', 400));
    }

    currentUser.password = req.body.password;
    currentUser.passwordConfirm = req.body.password;
    currentUser.passwordResetToken = undefined;
    currentUser.passwordResetExpires = undefined;
    await currentUser.save();

    access_token = signToken(currentUser.id);

    res.status(200).json({
        status:'Success',
        access_token,
    });
});

module.exports = {
    signup,
    login,
    authenticate,
    grantAccessTo,
    forgotPassword,
    resetPassword,
}
