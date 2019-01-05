const {
    ObjectID
} = require('mongodb');
const jwt = require('jsonwebtoken');

const {
    Todo
} = require('../../models/todo');
const {
    User
} = require('../../models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

let users = [{
    _id: userOneID,
    email: 'userOne@example.com',
    password: 'userOnePassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userOneID,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}, {
    _id: userTwoID,
    email: 'userTwo@example.com',
    password: 'userTwoPassword',
    tokens: [{
        access: 'auth',
        token: jwt.sign({
            _id: userTwoID,
            access: 'auth'
        }, process.env.JWT_SECRET).toString()
    }]
}];

let populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save();
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done())
};

let todos = [{
    _id: new ObjectID(),
    text: 'first test todos',
    _creator: userOneID
}, {
    _id: new ObjectID(),
    text: 'second test todos',
    completed: false,
    completedAt: 222,
    _creator: userTwoID
}];

let populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
}


module.exports = {
    users,
    populateUsers,
    todos,
    populateTodos
}