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


const sendErrorDev = (err, req, res) => {
    //API
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack

        })
    }
    //rendered website
    return res.status(err.statusCode).render('error', {
        title: 'something went wrong',
        msg: err.message
    })

}

const sendErrorProd = (err, req, res) => {
    // operational, trusted error: send message to client
    if (req.originalUrl.startsWith('/api')) {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            })

        }
        // programming or other unknown error: don't leak error details
        // 1) log error
        console.error('ERROR', err);

        //2) send generic message
        return res.status(500).json({
            status: 'error',
            message: 'something went very wrong!'
        })


    }
    if (err.isOperational) {
        // rendered website
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })

    }
    // programming or other unknown error: don't leak error details

    // 1) log error
    console.error('ERROR', err);

    //2) send generic message
    return res.status(500).json({
        status: 'error',
        message: 'please try again later'
    })



}

const handleJWTError = err => {
    new AppError('invalid token. Please login again!', 401)
}

const handleJWTExpiredError = err => {

    new AppError('Your token has expired. Please login again!', 401)
}

module.exports = (err, req, res, next) => {
    err.stausCode = err.statusCode || 500;
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);

    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;


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
        sendErrorProd(error, req, res);
    }

}

