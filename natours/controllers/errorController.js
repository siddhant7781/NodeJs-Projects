const AppError = require("../utils/appError")

const handleCastErrorDB = err => {

    const message = `invalid ${err.path}:${err.value}.`
    return new AppError(message, 404)
}
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])1(\\?.)*?\1/);
    const message = `Duplicate field value :${value}, please use another value`
    return new AppError(message, 404)
}
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400)
}


const sendErrorDev = (err, res) => {
    res.status(err.stausCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack

    })
}

const sendErrorProd = (err, res) => {
    // operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.stausCode).json({
            status: err.status,
            message: err.message,
        })

    }
    // programming or other unknown error: don't leak error details
    else {
        // 1) log error
        console.error('ERROR', err);

        //2) send generic message
        res.status(500).json({
            status: 'error',
            message: 'something went very wrong!'
        })
    }


}

const handleJWTError = err => {
    new AppError('invalid token. Please login again!', 401)
}

const handleJWTExpiredError = err => {

    new AppError('Your token has expired. Please login again!', 401)
}

module.exports = (err, req, res, next) => {
    err.stausCode = err.stausCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };


        if (error.name === 'CastError') {
            error = handleCastErrorDB(error)
        }
        if (error.code === 11000) {
            error = handleDuplicateFieldsDB(error)
        }
        if (error.name === 'ValidationError') {
            error = handleValidationErrorDB(error)
        }
        if (error.name === 'JsonWebTokenError') {
            error = handleJWTError()
        }
        if (error.name === 'TokenExpiredError') {
            error = handleJWTExpiredError()
        }
        sendErrorProd(error, res);
    }

}

