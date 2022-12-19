const Tour = require("../models/toursModel");
// const { waitForDebugger } = require('inspector');

//

/*param middleware (Check if ID is valid)*/
// const checkID = (req, res, next, val) => {
//     console.log(req.params.id);
//     if (req.params.id) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
//     next();
// };

// const checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price){
//         return res.status(404).json({
//             status: 'Failed',
//             message: 'Name or/and Price Not Found'
//         });
//     }
//     next();
// };

const getAllTours = async (req, res) => {
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryObj = { ...req.query };
    const exemptField = ["sort", "page", "limit", "fields"];
    exemptField.forEach((el) => delete queryObj[el]);

    const queryST = Tour.find(queryObj);

    const tours = await queryST;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
  //     res.status(200).json({
  //         status: "success",
  //         results: tours.length,
  //         requestedAt: req.requestTime,
  //         data: {
  //             tours
  //         }
  //     });
};

const getSingleTour = async (req, res) => {
  try {
    const { id } = req.params;
    const tour = await Tour.findById(id);

    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
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
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
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
    const { id } = req.params;
    const { body } = req;
    const updatedTour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        updatedTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
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
  // checkBody
  // checkID
};
