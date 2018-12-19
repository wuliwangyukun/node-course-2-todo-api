var {
    ObjectID
} = require('mongodb');
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
        res.status(400).send(err)
    })
});

app.get('/todos', (req, res) => {
    console.log('get:', req.body);
    Todo.find().then(todos => {
        res.send({
            body: todos,
            code: 200
        })
    }, err => {
        res.status(400).send(111)
    })
})

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('page not found');
    }
    Todo.findById(id).then(todo => {
        if (todo) {
            return res.send({
                todo
            })
        }
        return res.status(404).send('empty body')
    }).catch(e => res.status(400).send(e))
})

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('404 not found')
    };
    Todo.findByIdAndRemove(id).then(todo => {
        if (todo) {
            return res.status(200).send({
                todo
            })
        }
        res.status(404).send('empty body')
    }).catch(e => res.status(400).send(e))
})

app.listen(3000, () => {
    console.log('Started on port 3000');
})

module.exports = {
    app
}