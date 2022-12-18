const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour name required'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'Tour Price Required'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
