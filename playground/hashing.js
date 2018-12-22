const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data = {
    id: 10
};

let token = jwt.sign(data, 'you secret');
console.log(token);
let decodeToken = jwt.verify(token, 'you secret');
console.log(decodeToken);

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