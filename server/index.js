import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import serverConfig from './config'
import passportConfig from './lib/passportConfig.js'
import { Nuxt, Builder } from 'nuxt'
import routes from './routes'
const MongoStore = require('connect-mongo')(session)

// Create app
const app = express()
const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

// Set up DB connection
mongoose.connect(serverConfig.db, { useMongoClient: true })
mongoose.set('Promise', Promise)
mongoose.Promise = Promise

const db = mongoose.connection

// Options for Session Storage
const sessionStoreOptions = {
  mongooseConnection: db
}

app.use(bodyParser.json({limit: '2mb'}))

// Initialize session data and passport
app.use(session({
  secret: serverConfig.sessionSecret,
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: false, // todo turn this to true in prod
    maxAge: serverConfig.sessionLength * 1000 // multiplied * 1000 b/c measure in millis
  },
  store: new MongoStore(sessionStoreOptions)
}))
app.use(passport.initialize())
app.use(passport.session())
passportConfig(passport)

app.set('port', port)

// Import API Routes
app.use('/api', routes)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

// Init Nuxt.js
const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt)
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render)

// Listen the server
app.listen(port, host)
console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
