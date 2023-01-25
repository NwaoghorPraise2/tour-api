const express = require('express');
require('dotenv').config();
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const logger = require('morgan');
const globalErrorHandler = require('./controller/errorHandler')
const appError = require('./utils/appError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

/*Middlewares*/


const app = express();
//set secuirity helmet
// app.use(helmet());

app.use(express.static('public'));
app.use(express.json());
// app.use((req, res, next) => {
//   console.log('hello middle');
//   next();
// });

//test this rate limiterr...
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in one Hour...'
})

app.use('/api', limiter);

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
