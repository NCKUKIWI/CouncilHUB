const express = require('express')
const router = express.Router()
const db = require('../models/db')

// 取得某特定議事的所有議案的提案單位名稱
router.get('/:delibrationID', function (req, res) {
  const id = req.params.delibrationID
  db.Query('SELECT name FROM proposal WHERE delibrationID =' + id, function (result) {
    if (result.length === 0) {
      res.send('None')
    } else {
      res.json(result)
    }
  })
})

router.post('/voteResults', function (req, res) {
  const proposalID = req.body.proposalID
  const isAmendment = req.body.amendment
  const selectResultSql = 'SELECT result FROM `vote` WHERE WHERE proposalID = ' + proposalID + ' and amendment = ' + isAmendment
  db.Query(selectResultSql, function (votes, err) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      let agree = 0
      let disagree = 0
      let spoil = 0
      let total = 0
      for (const n in votes) {
        console.log(votes[n])
        total = total + 1
        if (votes[n].result === 1) {
          agree = agree + 1
        }
        if (votes[n].result === 2) {
          disagree = disagree + 1
        }
        if (votes[n].result === 3) {
          spoil = spoil + 1
        }
      }
      res.status(200).json({
        amendment: isAmendment,
        agree: agree,
        disagree: disagree,
        spoil: spoil
      })
    }
  })
})

// 取得某特定議事的某特定議案的資料
router.get('/:delibrationID/:proposalID', function (req, res) {
  const condition = {
    delibrationID: req.body.delibrationID,
    proposalID: req.body.proposalID
  }

  const cols = ['id', 'dept', 'reason', 'description', 'discussion']

  db.FindbyColumn('proposal', cols, condition, function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      res.status(200).send(result)
    }
  })
})

router.post('/resultsList', function (req, res) {
  const proposalID = req.body.proposalID
  const isAmendment = req.body.amendment
  const selectVoteSql = 'SELECT studentID, result FROM `vote` WHERE proposalID = ' + proposalID + ' and amendment = ' + isAmendment
  db.Query(selectVoteSql, function (votesInfo, err) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      const data = []
      for (const n in votesInfo) {
        // console.log(votesInfo[n])
        const column = ['department', 'uName']
        db.FindbyColumn('user', column, { studentID: votesInfo[n].studentID }, function (userinfo, err) {
          if (err) {
            console.log(err)
            res.sendStatus(400)
          } else {
            const studentVoteInfo = {
              index: parseInt(n) + 1,
              department: userinfo[0].department,
              name: userinfo[0].uName,
              voteResult: votesInfo[n].result
            }
            // console.log("PPP: ", studentVoteInfo)
            data.push(studentVoteInfo)

            if (n === votesInfo.length - 1) {
              res.status(200).send(data)
            }
          }
        })
      }
    }
  })
})

router.post('/voteAmendment', function (req, res) {
  const proposalID = req.body.proposalID
  const studentID = req.body.studentID
  const result = req.body.result
  const voteResultSql = 'INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( ' + proposalID + ", '" + studentID + "', " + result + ', 1)'
  db.Query(voteResultSql, function (voteResult, err) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      res.sendStatus(200)
    }
  })
})

router.post('/voteResolution', function (req, res) {
  const proposalID = req.body.proposalID
  const studentID = req.body.studentID
  const result = req.body.result
  const voteResultSql = 'INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( ' + proposalID + ", '" + studentID + "', " + result + ', 0)'
  db.Query(voteResultSql, function (voteResult, err) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      res.sendStatus(200)
    }
  })
})

// 新增議案
router.post('/createProposal/:delibrationID', function (req, res) {
  const data = {
    delibrationID: req.params.delibrationID,
    dept: req.body.dept,
    reason: req.body.reason,
    description: req.body.description
  }

  db.Insert('proposal', data, function (err, result) {
    if (err) {
      console.log(err)
      res.status(403).send()
    } else {
      res.status(201).send()
    }
  })
})

// 刪除議案
router.post('/deleteProposal/:proposalID', function (req, res) {
  const proposalID = req.params.proposalID

  db.DeleteById('proposal', proposalID, function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      res.sendStatus(200)
    }
  })
})

// 儲存修改的議案
router.post('/saveEditProposals/:id', function (req, res) {
  const userID = req.params.id
  const proposals = req.body.proposal

  db.FindbyColumn('user', ['position'], { id: userID }, function (result) {
    if (result[0].position === 'leader') {
      for (const data in proposals) {
        const dataProposal = {
          dept: proposals[data].dept,
          reason: proposals[data].reason,
          description: proposals[data].description,
          discussion: proposals[data].discussion
        }

        db.Update('proposal', dataProposal, { id: proposals[data].proposalID }, function (err) {
          if (err) {
            console.log(err)
            res.sendStatus(400)
          } else {
            res.sendStatus(201)
          }
        })
      }
    } else {
      res.sendStatus(403)
    }
  })
})

module.exports = router
