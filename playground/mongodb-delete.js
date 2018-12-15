const {
    MongoClient
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
    const db = client.db('TodoApp');

    // 按条件查找删除整个匹配
    // db.collection('Todos').deleteMany({
    //     text: 'eat lunch'
    // }).then(result => {
    //     console.log(result);
    // })

    // 按条件查找删除最后一个
    // db.collection('Todos').deleteOne({
    //     complete: true
    // }).then(result => {
    //     console.log(result);
    // })

    // 按条件查找找到第一个并删除
    db.collection('Todos').findOneAndDelete({
        text: 'make love'
    }).then(result => {
        console.log(result);
    })

    client.close();
})