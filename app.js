const express = require('express');
require('dotenv').config();
const logger = require('morgan');
const {globalErrorHandler} = require('./controller/index');
const appError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/*Middlewares*/
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use((req, res, next) => {
  console.log('hello middle');
  next();
});

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
  });
}

app.use(logger('dev'));
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) =>{
  next(new appError(`We do not have this route ${req.originalUrl} on our server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
