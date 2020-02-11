const promise = require('bluebird')

// Initialization Options
const initOption = {
  promiseLib: promise
}

const pgp = require('pg-promise')(initOption)
// const pgp = require('pg-promise')();
// config variables
const config = require('../config/config.js')

const connectionString = {
  host: config.db_host,
  port: config.db_port,
  database: config.db_name,
  user: config.db_user,
  password: config.db_pass
}
const db = pgp(connectionString)

module.exports = db
