const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('../../models/toursModel');
require('dotenv').config();

// console.log(process.argv);

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

connect();

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// console.log(tours);

const deleteTours = async () => {
  try {
    await Tour.deleteMany();
    console.log('tours deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const importTour = async () => {
  try {
    await Tour.create(tours);
    console.log('imorteddd');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importTour();
} else if (process.argv[2] === '--delete') {
  deleteTours();
}
