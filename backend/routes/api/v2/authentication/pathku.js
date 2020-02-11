const fs = require('fs')
const path = require('path')

// let pkey = fs.readFileSync(path.join(__dirname, 'test.key'), 'utf8');
// let pkey = path.basename(path.basename(path.dirname(__dirname)))
// let data = path.dirname(path.dirname(path.dirname(path.dirname(__dirname)))).split(path.sep).pop()

// let reqPath = path.join(__dirname, '../../../../key');//It goes three folders or directories back from given __dirname.
const locationKeySecret = path.join(__dirname, '../../../../key/ecdsa_private_key.pem')
const locationkeyPublic = path.join(__dirname, '../../../../key/ecdsa_public_key.pem')
// const keySecret = '';
// let keyPublic = '';

// https://stackoverflow.com/questions/6456864/why-does-node-js-fs-readfile-return-a-buffer-instead-of-string
// async
// const readSecret = fs.readFile(locationKeySecret, function (err, data) {
//     if (err) throw err;
//     // console.log(data.toString());
//     const keySecret = data.toString();

// });

// const readPublic = fs.readFile(locationkeyPublic, function (err, data) {
//     if (err) throw err;
//     // console.log(data.toString());
//     const keyPublic = data.toString();
// });
var keySecret = fs.readFileSync(locationKeySecret, 'utf8')
var keyPublic = fs.readFileSync(locationkeyPublic, 'utf8')

// console.log(fs.readFile(locationKeySecret));
console.log(keySecret)
console.log(keyPublic)
