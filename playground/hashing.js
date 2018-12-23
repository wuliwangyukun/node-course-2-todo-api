const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); //每次生成不一样的hash


//3
const saltRounds = 10;
var password = 'abc123';

// To hash a password:
// 生成salt
// bcrypt.genSalt(saltRounds, (err, salt) => {
//     生成hash
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     })
// });

// To check a password
let hashedPassword = '$2a$10$eLjTZaCZOAOJhbBfqCCzTOSDZeDOm496feti5mxaqFL28tlp7YISW';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res); //是否匹配
})


// 2
// let data = {
//     id: 10
// };

// let token = jwt.sign(data, 'you secret');
// console.log(token);
// let decodeToken = jwt.verify(token, 'you secret');
// console.log(decodeToken);


// 1
// var message = 'I am number 3';
// var hash = SHA256(message).toString();
// console.log(message);
// console.log(hash);

// var data = {
//     id: 4
// };
// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// if (resultHash === token.hash) {
//     console.log('token was not changed')
// } else {
//     console.log('data was changed, do not trust!');
// }