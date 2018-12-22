const {
    mongoose
} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not valid email'
        },
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

// 过滤返回的信息
userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

userSchema.methods.generateAuthToken = function () {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'web secret').toString();

    // 更改user model
    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    // 保存更改
    return user.save().then(() => {
        return token;
    })
}

var User = mongoose.model('User', userSchema);

module.exports = {
    User
};