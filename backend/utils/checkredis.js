require('dotenv').config()
const redis = require('redis')
const config = require('../config/config')
const client = redis.createClient(
  config.redis_port,
  config.redis_host
)

module.exports = function (msg) {
  client.get(msg, function (error, result) {
    if (error) {
      console.log(error)
      throw error
    }
    console.log('GET result ->' + result)
    // result
    process.exit(1)
  })
}
