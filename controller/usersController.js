const User =  require('../models/usersModel');
const AppError = require('../utils/appError');
const ansycHandler = require('../utils/catchAsync');

const getAllUsers = ansycHandler( async (req, res, next) => {

  const users = await User.find();

  res.status(500).json({
    status: 'success',
    message: 'All users Found',
    data: {
      users
    }
  });
});

const updateMe = ansycHandler(async (req, res, next)=> {
  if(req.body.password || req.body.passwordConfirm) {
    return next( new AppError('You cannot update password from this route', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'User Profile Updated'
  });
});

const getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not handled',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not handled',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not handled',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not handled',
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
};
