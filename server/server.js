var express = require('express');
var bodyParser = require('body-parser');

var {
    Todo
} = require('../models/todo');
var {
    User
} = require('../models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        text: req.body.text
    })
    todo.save().then(doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(e)
    })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
})

// var newTodo = new Todo({
//     text: ' something to do  '
// });

// newTodo.save().then(doc => {
//     console.log(doc)
// }, err => {
//     console.log('save newTodo failed');
// })

// var newUser = new User({
//     email: 'baby@qq.com'
// })

// newUser.save().then(doc => {
//     console.log(JSON.stringify(doc, undefined, 2));
// }, err => {
//     console.log('Unable to save user', err)
// })