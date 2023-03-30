const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const mongoSnitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');



const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//  Gloabal Middlewares

//serving static files
app.use(express.static(path.join(__dirname, 'public')))
// set security HTTP headers
app.use(helmet());

// Data Sanitization against NoSQL query injection
app.use(mongoSnitize());

// Data Sanitization against XSS
app.use(xss());

// prevent parameter pollutiom
app.use(hpp({
    whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))

//development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//LIMIT  REQUESTS FROM SAME API OR IP
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests form this IP, please try again in an hour!'
});

app.use('/api', limiter);

//Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' }));


//test middlewares
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    next();
})

//Routes

app.use('/', viewRouter)
app.get('/', (req, res) => {
    res.status(200).render('base', {
        tour: 'The Forest Hiker',
        user: 'jonas'
    });
})

app.get('/overview', (req, res) => {
    res.status(200).render('overview', {
        title: 'All tours'
    });
})
app.get('/tour', (req, res) => {
    res.status(200).render('tour', {
        title: 'The forest hiker tour'
    });
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)

app.all('*', (req, res, next) => {
    next(new AppError(`cant find ${req.originalUrl} on this server!`, 404))
});

app.use(globalErrorHandler);

//start server
module.exports = app;


