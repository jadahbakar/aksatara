require('module-alias/register')
const createError = require('http-errors')
const express = require('express')
// const expressStaticGzip = require('express-static-gzip')
require('dotenv').config()
const helmet = require('helmet')
const path = require('path')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const winston = require('./config/winston')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(
//   '/',
//   expressStaticGzip(path.join(__dirname, 'public'), {
//     maxAge: '365d',
//     setHeaders: function (res, path) {
//       if (mime.lookup(path) === 'text/html') {
//         res.setHeader('Cache-Control', 'public, max-age=0')
//       }
//     }
//   })
// )

app.use(cors())
// app.options("*", cors());

app.set('views', path.join(__dirname, 'views')) // view engine setup
app.set('view engine', 'ejs')
app.use(morgan('combined', { stream: winston.stream }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.disable('etag')
// app.disable('etag').disable('x-powered-by');
app.disable('Last-Modified')

// for Security Reason we use
app.use(helmet())
app.use(helmet.expectCt())
app.use(helmet.noCache())
app.use(helmet.referrerPolicy())

app.use((req, res, next) => {
  res.removeHeader('Cache-Control')
  res.removeHeader('Connection')
  res.removeHeader('Expect-CT')
  res.removeHeader('Expires')
  res.removeHeader('Pragma')
  res.removeHeader('Referrer-Policy')
  res.removeHeader('Strict-Transport-Security')
  res.removeHeader('Surrogate-Control')
  res.removeHeader('X-DNS-Prefetch-Control')
  res.removeHeader('X-Download-Options')
  res.removeHeader('X-Frame-Options')
  res.removeHeader('X-RateLimit-Limit')
  res.removeHeader('X-RateLimit-Remaining')
  res.removeHeader('X-RateLimit-Reset')
  res.removeHeader('X-XSS-Protection')
  next()
})

app.use(require('./routes'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
  // res.status(500).send({ error: "Internal server error happened" });
})

module.exports = app
