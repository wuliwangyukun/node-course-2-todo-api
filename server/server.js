require('../config/config.js');
const {
    ObjectID
} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
var {
    Todo
} = require('../models/todo');
var {
    User
} = require('../models/user');

var app = express();
var port = process.env.PORT;

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
        return res.status(404).send('404 not found');
    }
    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send('empty body')
        }
        return res.send({
            todo
        })
    }).catch(e => res.status(400).send(e))
})

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('404 not found')
    };
    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            res.status(404).send('empty body')
        }
        return res.status(200).send({
            todo
        })
    }).catch(e => res.status(400).send(e))
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('404 not found');
    }
    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then(todo => {
        if (!todo) {
            res.status(404).send('empty body');
        }
        res.send({
            todo
        });
    }).catch(e => res.status(400).send())
});

// POST /users
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
            return user.generateAuthToken();
        }).then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(e => res.status(400).send(e))
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {
    app
}