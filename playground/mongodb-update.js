const {
    MongoClient,
    ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, client) => {
    if (error) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('connected to MongoDB server');
    const db = client.db('TodoApp');

    // new ObjectID('5c14b6b5ca47d805061961fc') === '5c14b6b5ca47d805061961fc'
    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5c14b6b5ca47d805061961fc')
    }, {
        // 对field重新赋值
        $set: {
            location: 'changsha'
        },
        // 对int类型的field进行增减
        $inc: {
            age: 1
        }
    }, {
        // 取消返回原来的document而是返回更新的结果
        returnOriginal: false
    }).then(result => {
        console.log(result);
    })

    client.close();
})