const mongoose = require('mongoose');
const { config } = require('dotenv');

config();
const connect = async () => {
  try {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = connect;
