var router = require('express').Router()
// const rateLimit = require('express-rate-limit') // limit
// const RedisStore = require('rate-limit-redis')

// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 1 minutes
//   max: 1000000, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   statusCode: 429,
//   headers: false,
//   store: new RedisStore({
//     // see Configuration https://github.com/wyattjoh/rate-limit-redis#readme
//     expiry: 60
//   })
// })

// router.use('/v1', limiter, require('./v1'))
// router.use('/v2', limiter, require('./v2'))

router.use('/v1', require('./v1'))

module.exports = router
