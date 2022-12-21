/* eslint-disable node/no-unsupported-features/es-syntax */
const Tour = require('../models/toursModel');

const getAllTours = async (req, res) => {
  try {
    const queryObj = {...req.query};
    const exemptField = ['sort', 'page', 'limit', 'fields'];
    exemptField.forEach((el) => delete queryObj[el]);

    //Advanved Filter
    let querySTR = JSON.stringify(queryObj);
    querySTR = querySTR.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const queryST = Tour.find(JSON.parse(querySTR));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      queryST.sort(sortBy);
    } else {
      queryST.sort('-createdAt');
    }

    //fields
    if (req.query.fields) {
      const fieldBy = req.query.fields.split(',').join(' ');
      console.log(req.query.fields);
      queryST.select(fieldBy);
    } else {
      queryST.select('-__v');
    }

    //pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    queryST.skip(skip).limit(limit);

    if (req.query.page) {
      const numTour = await Tour.countDocuments();
      if (skip >= numTour) {
        throw new Error('page doesnot exist');
      }
    }

    const tours = await queryST;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }
};

const getSingleTour = async (req, res) => {
  try {
    const {id} = req.params;
    const tour = await Tour.findById(id);

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: [err.message],
    });
  }
  //     const id = req.params.id;
  //     const tour = tours.find( el => el.id == id);
  //     console.log(tour);

  //     res.status(200).json({
  //         status: "success",
  //         data: {
  //             tour,
  //         }
  //     });
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }

  //     const id = uuid();
  //     const newTour = Object.assign({id}, req.body)

  //     tours.push(newTour);

  //     console.log(newTour);
  //     fs.writeFile
  //     (`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {

  //     });
};

const updateTour = async (req, res) => {
  try {
    const {id} = req.params;
    const {body} = req;
    const updatedTour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const {id} = req.params;
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
};
