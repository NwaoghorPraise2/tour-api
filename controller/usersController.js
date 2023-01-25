const { findByIdAndUpdate } = require('../models/usersModel');
const User =  require('../models/usersModel');
const AppError = require('../utils/appError');
const ansycHandler = require('../utils/catchAsync');

const filterInput = (obj, ...allowedFields) => {
  const filteredObj = {};
  Object.keys(obj).forEach(el => {
    if(allowedFields.includes(el)) filteredObj[el] = obj[el];
  })

  return filteredObj;
};

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

  const filtedReq = filterInput(req.body,'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filtedReq, { new: true, runValidators: true});

  res.status(200).json({
    status: 'success',
    message: 'User Profile Updated',
    data: {
      user: updatedUser
    }
  });
});

const deleteMe = ansycHandler( async(req,res,next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false});

  res.status(204).json({
    status: 'success',
    data: null
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
  deleteMe
};
