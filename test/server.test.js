const request = require('supertest');
const expect = require('expect');
const {
    ObjectID
} = require('mongodb');
const {
    app
} = require('../server');
const {
    Todo
} = require('../models/todo');
const {
    User
} = require('../models/user');

const {
    users,
    populateUsers,
    todos,
    populateTodos
} = require('./send/send');

// 测试前填充新的Todos
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'add new todo';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(3);
                    expect(todos[2].text).toBe(text);
                    done();
                }).catch(e => done(e))
            })
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e))
            })
    })
});

describe('GET /todos', () => {
    it('should return todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.body.length).toBe(1)
            })
            .end(done)
    })
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it('should not return todo doc create by other user', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 if not-object id', (done) => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })
});

describe('DELETE /todos/:id', () => {
    it('should remove todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then(todo => {
                    console.log(111, todo);
                    expect(todo).toBeNull();
                    done();
                }).catch(e => done(e))
            })
    });

    it('should not remove todo create by other user', (done) => {
        let hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId).then(todo => {
                    console.log(222, todo);
                    expect(todo._id).toEqual(todos[0]._id)
                    done();
                }).catch(e => done(e))
            })
    });

    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    });

    it('should return 404 if none-object id', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done)
    })
});

describe('UPDATE /todos/:id', () => {
    it('should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let body = {
            text: 'this new todos 1',
            completed: true
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(body.text);
                // expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)
    });

    it('should not update the todo', (done) => {
        let hexId = todos[1]._id.toHexString();
        let body = {
            text: 'this new todos 1',
            completed: true
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(404)
            .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[0]._id.toHexString();
        let body = {
            text: 'add todos 111111',
            completed: false
        };
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completedAt).toBeNull();
            })
            .end(done)
    })
})

describe('GET /users/me', () => {
    it('should return user of authenticate', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done)
    })

    it('should return 401 of not authenticate', done => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect(res => {
                expect(res.body).toEqual({})
            })
            .end(done)
    })
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'example@example.com';
        let password = 'examplePassword';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeDefined();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) {
                    return done(err)
                }
                User.findOne({
                    email
                }).then((user) => {
                    expect(user).toBeDefined();
                    expect(user.password).not.toEqual(password);
                    done();
                })
            })
    });

    it('should return validation errors if request invalid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'wyk',
                password: '124'
            })
            .expect(400)
            .end(done)
    })

    it('should not create user if eamil is use', (done) => {
        var email = todos[0].email;
        let password = 'examplePassword';
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done)

    });

    describe('POST /users/login', () => {
        it('should login user and return user token', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toBeDefined();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findById(users[1]._id).then((user) => {
                            expect(user.tokens[1].token).toEqual(
                                res.headers['x-auth']
                            );
                            done();
                        })
                        .catch(e => done(e))
                })
        });

        it('should reject invalid login', (done) => {
            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password + '123'
                })
                .expect(400)
                .expect((res) => {
                    expect(res.headers['x-auth']).toBeUndefined();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findById(users[1]._id).then((user) => {
                            expect(user.tokens.length).toBe(1)
                            done();
                        })
                        .catch(e => done(e))
                })
        })
    })

    describe('DELETE /users/me/token', () => {
        it('should remove auth token on logout', (done) => {
            request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findById(users[0]._id).then((user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch(e => done(e))
                });
        })
    })
})