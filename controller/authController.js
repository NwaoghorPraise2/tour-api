const User = require('../models/usersModel');
const ansycHandler = require('../utils/catchAsync');

const signup = ansycHandler(async (req, res, next) => {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'Success',
        message: 'User created successfully!',
        data: {
            user: newUser
        },
    });
 
});


module.exports = {
    signup,
}
