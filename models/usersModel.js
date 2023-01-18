const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'Please tell us your name!']
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: String,
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user'
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function(el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!'
      }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    passwordChangedAt: Date,
  });

  userSchema.pre('save', async function(next) {
    //check if password was actaully modified
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, Number(process.env.SALT));

    this.passwordConfirm = undefined;
    
    next();
  });

  userSchema.methods.checkPasswordChange = function(JWTTimeStamp) {
    if (this.passwordChangedAt) {
      const changedTime = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
      
      return JWTTimeStamp < changedTime;
    }

    return false;
  };


  userSchema.methods.matchPassword = async function (userPassword, Password) {
    return await bcrypt.compare(userPassword, Password);
  };

  userSchema.methods.createPasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');

    console.log(`The token sent to the client ${resetToken}`);

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.passwordResetExpires = Date.now() * 10 * 60 * 1000;

    console.log(`This is the Expire time: ${this.passwordResetExpires}`);

    console.log(`This one is the hash stored in DB ${this.passwordResetToken}`);
    
    return resetToken;
  };
 
  const User = mongoose.model('User', userSchema);

  module.exports = User;