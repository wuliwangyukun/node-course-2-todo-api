var {
    ObjectID
} = require('mongodb');

var {
    Todo
} = require('../models/todo');
var {
    mongoose
} = require('../db/mongoose');

// Todo.remove({}).then(result => {
//     console.log(result)
// });

// Todo.findOneAndRemove({
//     _id: '5c190937619eea67e4f66553'
// }).then(todo => {
//     console.log(todo);
// });

// Todo.findByIdAndRemove('5c190937619eea67e4f66554').then(todo => {
//     console.log(todo);
// })