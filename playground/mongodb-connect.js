const {
    MongoClient,
    ObjectID
} = require('mongodb')

// 连接本地(localhost)的mongo服务器上的TodoApp数据库
// mongoDB在连接一个数据库之前并不需要创建这个数据库
// 我们为这个数据库添加数据时便会自动创建这个数据库
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        console.log('Unable to connect to MongoDB server')
    }
    console.log('connected to MongoDB server');
    const db = client.db('TodoApp');

    // 在Todos中添加一个document，如果没有Todos collection就先创建这个collection
    // 会自带一个_id属性作为默认的唯一标识符，也可以手动添加_id属性（不推荐）
    // db.collection('Todos').insertOne({
    //     text: 'something to do',
    //     completed: true
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert todo');
    //     }
    //     // 另外两个参数——未定义的过滤函数和缩进
    //     console.log(JSON.stringify(result.ops, undefined, 2))
    // });

    db.collection('Users').insertOne({
        name: 'oyss',
        age: 18,
        location: 'changsha'
    }, (error, result) => {
        if (error) {
            console.log('Unable to insert user')
        }
        console.log(result.ops)
    });

    client.close();
});

// ps:
// document的默认_id属性，可以使用getTimestamp方法得到时间戳。