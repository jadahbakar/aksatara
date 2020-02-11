// // index.js
var redis = require('redis')
var client = redis.createClient()
client.on('error', function (err) {
  console.log(err)
})
// client.set("akey", "string val", redis.print);
// client.get("akey", redis.print);

// var redis = require("redis"),
//   client = redis.createClient({
//     host: process.env.REDIS_HOST || "127.0.0.1"
//   });

// ------ Clear all data
// client.flushdb(function(err, succeeded) {
//   console.log(succeeded); // will be true if successfull
// });

// client.flushall('ASYNC', callback)
