var env = process.env.NODE_ENV || 'development';
console.log('env ****** ', env);

if (env === 'development') {
    process.env.MONGODB_URL = 'mongodb://localhost:27017/TodoApp2';
    process.env.PORT = 3000;
} else if (env === 'test') {
    process.env.MONGODB_URL = 'mongodb://localhost:27017/todoAppTest';
    process.env.PORT = 3000;
}