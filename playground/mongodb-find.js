const {
    MongoClient
} = require('mongodb')


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to MongoDB server')
    }
    console.log('connected to MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').find({
    //     completed: false
    // }).toArray().then(docs => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs));
    // }, error => {
    //     console.log('Unable to fetch Todos', error);
    // })

    // db.collection('Users').find().count().then(count => {
    //     console.log(`Todo count: ${count}`)
    // }, error => {
    //     console.log('Unable to fetch Todos', error);
    // });

    db.collection('Users').find({
        age: 18
    }).toArray().then(docs => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 2));
    }, error => {
        console.log('Unable to fetch Users', error);
    })

    client.close();
});