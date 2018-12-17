var request = require('supertest');
var expect = require('expect');
var {
    app
} = require('./server');
var {
    Todo
} = require('../models/todo');

let todos = [{
    text: 'add todos 1'
}, {
    text: 'add todos 2'
}]

// 每次测试前清空Todo
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => done());
})

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'add new todo';

        request(app)
            .post('/todos')
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
            .expect(200)
            .expect((res) => {
                expect(res.body.body.length).toBe(2)
            })
            .end(done)
    })
})