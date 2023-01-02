const express = require('express');
const {userController, authController} = require('../controller/index');

const router = express.Router();

router
  .route('/signup')
  .post(authController.signup);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
