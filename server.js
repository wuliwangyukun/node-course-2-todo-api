require('./config/config.js');
const {
    ObjectID
} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var {
    Todo
} = require('./models/todo');
var {
    User
} = require('./models/user');
var {
    authenticate
} = require('./middleware/authenticate');

var app = express();
var port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    console.log(req.body);
    let todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    })
    todo.save().then(doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(err)
    })
});

app.get('/todos', authenticate, (req, res) => {
    console.log('get:', req.body);
    Todo.find({
        _creator: req.user._id
    }).then(todos => {
        res.send({
            todos,
        })
    }, err => {
        res.status(400).send(111)
    })
})

app.get('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('404 not found');
    }
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then(todo => {
        if (!todo) {
            return res.status(404).send('empty body')
        }
        return res.send({
            todo
        })
    }).catch(e => res.status(400).send(e))
})

app.delete('/todos/:id', authenticate, (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('404 not found')
    };
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then(todo => {
        if (!todo) {
            res.status(404).send('empty body')
        }
        return res.status(200).send({
            todo
        })
    }).catch(e => res.status(400).send(e))
});

app.patch('/todos/:id', authenticate, (req, res) => {
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
    Todo.findOneAndUpdate({
        _id: id,
        _creator: req.user._id
    }, {
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
    // 选择有用的信息
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
            return user.generateAuthToken();
        }).then(token => {
            res.header('x-auth', token).send(user);
        })
        .catch(e => res.status(400).send(e))
});

// GET /users/me private route
app.get('/users/me', authenticate, (req, res) => {
    // let token = req.header('x-auth');

    // User.findByToken(token).then(user => {
    //     if (!user) {
    //         res.status(401).send();
    //     }
    //     res.status(200).send(user)
    // }).catch(e => res.status(401).send());
    // 使用了middleware
    res.status(200).send(req.user);
})

app.post('/users/login', (req, res) => {
    let {
        email,
        password
    } = _.pick(req.body, ['email', 'password']);
    console.log('email, password', email, password);
    User.findByCredentials(email, password).then(user => {
            return user.generateAuthToken().then(token => {
                res.header('x-auth', token).send(user)
            })
        })
        .catch(e => res.status(400).send())
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    })
})

app.listen(port, () => {
    console.log(`Started on port ${port}`);
})

module.exports = {
    app
}