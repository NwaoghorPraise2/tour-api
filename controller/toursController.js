/* eslint-disable node/no-unsupported-features/es-syntax */
const {toursModel} = require('../models/index');

const Tour = toursModel;
const APIFeatures = require('../utils/apiFeatures');

const alaistopTours = async (req, res, next) => {
  req.query.sort = '-ratingAverage,-price';
  req.query.limit = '5';
  req.query.fields = 'price,ratingsAverage,summary,difficulty,';
  next();
};

const getAllTours = async (req, res) => {
  try {
    //handle Querys
    const feature = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await feature.query;

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

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {ratingsAverage: {$gte: 4.5}},
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          numTours: {$sum: 1},
          numRatings: {$sum: '$ratingsQuantity'},
          avgRating: {$avg: '$ratingsAverage'},
          avgPrice: {$avg: '$price'},
          minPrice: {$min: '$price'},
          maxPrice: {$max: '$price'},
        },
      },
      {
        $sort: {avgPrice: 1},
      },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {$month: '$startDates'},
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'},
        },
      },
      {
        $addFields: {month: '$_id'},
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {numTourStarts: -1},
      },
      {
        $limit: 12,
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

module.exports = {
  getAllTours,
  getSingleTour,
  createTour,
  updateTour,
  deleteTour,
  alaistopTours,
  getTourStats,
  getMonthlyPlan,
};
