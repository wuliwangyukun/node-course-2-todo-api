var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true
});

module.exports = {
    mongoose
}