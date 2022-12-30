//Function to respond to error in development ENV
const devError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    }); 
}

//Function to respond to error in production ENV
const prodError = (err, res) => {
    //Check if error is Operational
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        //1) log to console
        console.error('Error oh', err);

        //2) send a nice mesage to client hahahahaha
        res.status(500).json({
            status: 'error',
            message: 'Oh, sorry went wrong'
        })
    }
}

module.exports = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        devError(err, res);
    } else if (process.env.NODE_ENV === 'development') {
        prodError(err, res);
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
}

