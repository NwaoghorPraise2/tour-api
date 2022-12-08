const { v4 : uuid} = require('uuid');
const fs = require('fs');
const { waitForDebugger } = require('inspector');

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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

const checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price){
        return res.status(404).json({
            status: 'Failed',
            message: 'Name or/and Price Not Found'
        });
    }
    next();
};

const getAllTours = (req, res)=> {
    res.status(200).json({
        status: "success",
        results: tours.length,
        requestedAt: req.requestTime,
        data: {
            tours
        }
    });
};

const getSingleTour = (req, res)=> {
    
    const id = req.params.id;
    const tour = tours.find( el => el.id == id);
    console.log(tour);

    res.status(200).json({
        status: "success",
        data: {
            tour,
        }
    });
};

const createTour = (req,res)=>{
    const id = uuid();
    const newTour = Object.assign({id}, req.body)
    
    tours.push(newTour);

    console.log(newTour);
    fs.writeFile
    (`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        });
    });

};


const updateTour =  (req,res) =>{
    
};


const deleteTour = (req,res) =>{
    
};


module.exports = {
    getAllTours,
    getSingleTour,
    createTour,
    updateTour,
    deleteTour,
    checkBody
    // checkID
}