const {
    mongoose
} = require('../db/mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;
var userSchema = new Schema({
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

// 添加实例方法：new User()
// userSchema.methods 
// NOTE: 在使用mongoose.model() 编译模式之前， 必须将方法添加到模式中

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
    }, process.env.JWT_SECRET).toString();

    // 更改user model  增加tokens成员
    user.tokens = user.tokens.concat([{
        access,
        token
    }]);

    // 保存更改
    return user.save().then(() => {
        return token;
    })
}

userSchema.methods.removeToken = function (token) {
    let user = this;
    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    })
}

// 添加静态方法
userSchema.statics.findByToken = function (token) {
    let User = this;
    let decode;

    try {
        decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decode._id,
        'tokens.token': token,
        'tokens.access': 'auth',
    })
}

userSchema.statics.findByCredentials = function (email, password) {
    let User = this;
    return User.findOne({
        email
    }).then(user => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user)
                }
                reject(err)
            })
        })
    })
}


// middleware
// user.save() 的中间件
userSchema.pre('save', function (next) {
    let user = this;
    //password改变，重新生成hash过后的password并保存
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
})

var User = mongoose.model('User', userSchema);

module.exports = {
    User
};