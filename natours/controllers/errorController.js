module.exports = (err, req, res, next) => {
    err.stausCode = err.stausCode || 500;
    err.status = err.status || 'error'

    res.status(err.stausCode).json({
        status: err.status,
        message: err.message

    })
}

