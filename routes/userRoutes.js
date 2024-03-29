const express = require('express');
const {userController, authController} = require('../controller/index');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.patch('/updateMyPassword', authController.authenticate, authController.updatePassword);

router.patch('/updateMe', authController.authenticate, userController.updateMe);
router.delete('/deleteMe', authController.authenticate, userController.deleteMe);

router
  .route('/')
  .get(authController.authenticate, userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(authController.authenticate, userController.deleteUser);

module.exports = router;
