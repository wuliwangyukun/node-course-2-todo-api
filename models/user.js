const {
    mongoose
} = require('../db/mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

module.exports = {
    User
};