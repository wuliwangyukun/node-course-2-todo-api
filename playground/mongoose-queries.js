var {
    ObjectID
} = require('mongodb');

var {
    User
} = require('../models/user');
var {
    mongoose
} = require('../db/mongoose');

var id = '5c15faa9941ed40a2f4e3b05';
if (!ObjectID.isValid(id)) {
    return console.log('id invaild');
}

User.find({
    _id: id
}).then(users => {
    console.log('users:', users)
});

User.findOne({
    _id: id
}).then(user => {
    console.log('user:', user);
});

User.findById(id).then(user => {
    if (!user) {
        return console.log('user id not found')
    }
    console.log('user by id:', user)
})