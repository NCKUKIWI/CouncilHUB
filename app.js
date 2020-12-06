const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const socket = require('socket.io')
const db = require('./models/db')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const cache = require('./helper/cache')
const redisHelper = cache.redis

app.use(cors({
  credentials: true,
  origin: 'http://localhost:8080'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(session({
  cookie: {
    maxAge: 1000 * 60 * 60 * 24
  },
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  store: new RedisStore({
    client: redisHelper
  })
}))

const http = app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
const io = socket(http)

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.use('/user', require('./routes/user'))
app.use('/proposal', require('./routes/proposal'))
app.use('/delibration', require('./routes/delibration'))

app.use(notFound)
app.use(errorHandler)

function errorHandler (err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  })
}

function notFound (req, res, next) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

io.on('connection', (socket) => {
  socket.on('entryVote', (msg) => { // 點進議案觸發
    const proposalID = msg.proposalID
    const isVotingSql = 'SELECT isVoting FROM `proposal` WHERE proposalID = ' + proposalID
    db.Query(isVotingSql, function (voteInfo, err) {
      const isVoting = voteInfo[0].isVoting
      if (isVoting === 0) {
        io.emit('closeVote', '投票結束囉') // 告訴大家
      } else if (isVoting === 1) {
        io.emit('startResolutionVote', '開始決議案投票') // 告訴大家
      } else if (isVoting === 2) {
        io.emit('startAmendmentVote', '開始修正案投票') // 告訴大家
      }
    })
  })

  socket.on('startResolution', (msg) => { // 議長觸發
    const proposalID = msg.proposalID
    const updateSql = 'UPDATE `proposal` SET isVoting = 1 WHERE proposalID = ' + proposalID
    db.Query(updateSql, function (updateResult, err) {
      io.broadcast.emit('startResolutionVote', '開始決議案投票') // 告訴大家
    })
  })
  socket.on('closeResolution', (msg) => { // 議長觸發
    const proposalID = msg.proposalID
    const updateSql = 'UPDATE `proposal` SET isVoting = 0 WHERE proposalID = ' + proposalID
    db.Query(updateSql, function (updateResult, err) {
      io.broadcast.emit('closeResolutionVote', '決議案投票結束') // 告訴大家
    })
  })

  socket.on('startAmendment', (msg) => {
    const proposalID = msg.proposalID
    const updateSql = 'UPDATE `proposal` SET isVoting = 2 WHERE proposalID = ' + proposalID
    db.Query(updateSql, function (updateResult, err) {
      io.broadcast.emit('startAmendmentVote', '開始修正案投票')
    })
  })
  socket.on('closeAmendment', (msg) => {
    const proposalID = msg.proposalID
    const updateSql = 'UPDATE `proposal` SET isVoting = 0 WHERE proposalID = ' + proposalID
    db.Query(updateSql, function (updateResult, err) {
      io.broadcast.emit('closeAmendmentVote', '修正案投票結束') // 同意不同意關掉
    })
    // 如果同意>反對 議長自己去改資料XD
  })
})
