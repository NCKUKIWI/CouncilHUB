const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const socket = require('socket.io')
const db = require('../models/db')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
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
