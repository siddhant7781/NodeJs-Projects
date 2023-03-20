const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create(
        //     //{
        //     name: req.body.name,
        //     email: req.body.email,
        //     password: req.body.password,
        //     passwordConfirm: req.password.confirm
        // }//
        req.body);

    const token = signToken(newUser._id)


    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // if email and password exists?
    if (!email || !password) {
        return next(new AppError('please provide email && password', 400));
    }

    // check if user exits && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('incorrect email or password', 401));
    }

    //if everything is ok, send token to client
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})


exports.protect = catchAsync(async (req, res, next) => {
    //1) getting token and check if it's exists
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError("you are not logged in! please get logged in to acess tours. ", 401))
    }

    //2) verification token : siper important step
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //3)check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('the user belonging to this token no longer exists.', 401))
    }

    //4) check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('user recently changed password! please login again', 401))
    };

    //Grant acess to protected route
    req.user = currentUser;
    next()
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles is an array ['admin', 'lead-guide']
        if (!roles.includes(req.user.role)) {
            return next(new AppError('you do not have permission to perform this action'))
        }
        next();
    }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) get user based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError('there is no user with this email address', 404));
    }
    //2) generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3) send it to user's email
    const resetURL = ` ${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

    const message = 'forgot your password? submit a patch record with your new password and password confirm.';

    try {


        await sendEmail({
            email: user.email,
            subject: 'your password reset token (only valids for 10 min)',
            message
        })

        res.status(200).json({
            status: 'sucess',
            message: 'token sent to email!'
        })
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new AppError('there was an error sending the email.Try again later', 500))
    }
});


exports.resetPassword = catchAsync(async (req, res, next) => {
    //1) get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    //2) if token has not expired and there is a user, set the new password
    if (!user) {
        return next(new AppError('token is invalid or expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();


    //3) update changedpasswordAt property for the user

    //4) log the user in, send jwt
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    })
})