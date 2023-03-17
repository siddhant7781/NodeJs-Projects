const mongoose = require('mongoose');
const validator = require('validator');
const userController = require('./../controllers/userController');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'please enter your name']
    },
    email: {
        type: String,
        require: [true, 'please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minlength: 8,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            }
        }
    }


});

const User = mongoose.model('User', userSchema);

module.exports = User;

