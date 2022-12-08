const express = require('express');
require('dotenv').config();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const morgan =  require('morgan');


/*Middlewares*/
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
    console.log('hello middle');
    next();
});

if (process.env.NODE_ENV === 'development'){
    app.use((req, res, next)=>{
        req.requestTime = new Date().toISOString();
        next();
    });
}


app.use(morgan('dev'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
