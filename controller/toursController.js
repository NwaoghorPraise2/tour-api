const {toursModel} = require('../models/index');
const appError = require('../utils/appError');
const asyncHandler = require('../utils/catchAsync');
const Tour = toursModel;
const APIFeatures = require('../utils/apiFeatures');

const alaistopTours = async (req, res, next) => {
  req.query.sort = '-ratingAverage,-price';
  req.query.limit = '5';
  req.query.fields = 'price,ratingsAverage,summary,difficulty,';
  next();
};

const getAllTours = asyncHandler(async (req, res, next) => {
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
});

const getSingleTour = asyncHandler(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    console.log(tour);

    if (!tour) {
      return next(new appError('No tour found with that ID.', 404));
    }

    res.status(201).json({
      status: 'success',
      data: {
        tour,
      },
    });
});

const createTour = asyncHandler(async (req, res, next) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
});

const updateTour = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const {body} = req;
    const updatedTour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTour) {
      return next(new appError('No tour found with that ID.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        updatedTour,
      },
    });
});

const deleteTour = asyncHandler(async (req, res, next) => {
    const {id} = req.params;
    const tour = await Tour.findByIdAndDelete(id);

    if (!tour) {
      return next(new appError('No tour found with that ID.', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
});

const getTourStats = asyncHandler(async (req, res, next) => {
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
});

const getMonthlyPlan = asyncHandler(async (req, res, next) => {
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
  });

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
