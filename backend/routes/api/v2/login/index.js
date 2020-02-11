var express = require('express')
var router = express.Router()

const loginPost = require('./login.post')
const loginGet = require('./login.get')

router.get('/', loginGet.getLogin)
router.post('/', loginPost.postLogin)

module.exports = router
