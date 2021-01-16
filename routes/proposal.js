const express = require('express')
const router = express.Router()
const db = require('../models/db')

// 已測試
// 取得某特定議事的所有議案的提案單位名稱
router.get('/:delibrationID', function (req, res) {
  const id = req.params.delibrationID
  db.Query('SELECT id, dept FROM proposal WHERE delibrationID =' + id, function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }
    res.status(200).json(result)
  })
})

// 已測試
// 取得某特定議事的某特定議案的資料
router.get('/:delibrationID/:proposalID', function (req, res) {
  const delibrationID = req.params.delibrationID
  const proposalID = req.params.proposalID

  db.Query('SELECT * FROM `proposal` WHERE id = "' + proposalID + '" AND delibrationID = "' + delibrationID + '"', function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }
    result[0].description = result[0].description.split('\n')
    res.status(200).send(result[0])
  })
})

// 已測試
router.post('/voteResults', function (req, res) {
  const proposalID = req.body.proposalID
  const isAmendment = req.body.isAmendment
  const selectResultSql = 'SELECT studentID, result FROM `vote` WHERE proposalID = ' + proposalID + ' AND amendment = ' + isAmendment
  db.Query(selectResultSql, function (err, votes) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }
    let agree = 0
    let disagree = 0
    let spoil = 0
    let total = 0
    for (const n in votes) {
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
    const data = []
    let count = 0
    for (const n in votes) {
      const selectUserSql = 'SELECT department, name FROM `user` WHERE studentID = "' + votes[n].studentID + '"'
      db.Query(selectUserSql, function (err, userinfo) {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        }
        count += 1
        const studentVoteInfo = {
          index: parseInt(n) + 1,
          department: userinfo[0].department,
          name: userinfo[0].name,
          voteResult: votes[n].result
        }
        // console.log("PPP: ", studentVoteInfo)
        data.push(studentVoteInfo)

        if (count === votes.length) {
          res.status(200).json({
            amendment: isAmendment,
            agree: agree,
            disagree: disagree,
            spoil: spoil,
            resultList: data
          })
        }
      })
    }
  })
})

// 已測試
// 判斷是否投過票
router.post('/isVoted', function (req, res) {
  const proposalID = req.body.proposalID
  const studentID = req.session.studentID
  const isAmendment = req.body.isAmendment
  const isVotedSql = 'SELECT * from vote WHERE proposalID = ' + proposalID + ' and studentID = "' + studentID + '" and amendment = ' + isAmendment
  db.Query(isVotedSql, function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }
    if (result.length > 0) {
      res.status(200).json({
        message: true,
        result: result[0].result
      })
    } else {
      res.status(200).json({
        message: false
      })
    }
  })
})

// 已測試
router.post('/vote', function (req, res) {
  const proposalID = req.body.proposalID
  const studentID = req.session.studentID
  const result = req.body.result
  const isAmendment = req.body.isAmendment
  const isVotedSql = 'SELECT * from vote WHERE proposalID = ' + proposalID + ' and studentID = "' + studentID + '" and amendment = ' + isAmendment
  const voteResultSql = 'INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( ' + proposalID + ', "' + studentID + '", ' + result + ', ' + isAmendment + ')'
  db.Query(isVotedSql, function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }
    if (result.length === 0) {
      db.Query(voteResultSql, function (err, voteResult) {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        }
        res.status(200).json({
          message: 'success'
        })
      })
    } else {
      res.status(200).json({
        message: 'voted'
      })
    }
  })
})

// 儲存修改的議案
router.put('/saveEditProposals', function (req, res) {
  const studentID = req.session.studentID
  db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    }
    if (result.length !== 0) {
      const delibrationID = req.body.delibrationID
      const proposals = req.body.proposal
      const proposalIDList = []
      let deleteProposalSQL = 'DELETE from `proposal` WHERE id in ('
      db.Query('SELECT id FROM `proposal` WHERE delibrationID = "' + delibrationID + '"', function (err, result) {
        if (err) {
          console.log(err)
          res.sendStatus(500)
        }
        let count = 0
        for (const data in proposals) {
          const proposalID = proposals[data].id
          proposalIDList.push(proposalID)
          const dataProposal = {
            delibrationID: delibrationID,
            dept: proposals[data].dept,
            name: proposals[data].name,
            reason: proposals[data].reason,
            description: proposals[data].description
          }
          if (proposalID === -1) {
            db.Insert('proposal', dataProposal, function (err, result) {
              if (err) {
                console.log(err)
                res.sendStatus(500)
              }
              count += 1
              if (count === proposals.length) {
                // db.Query(deleteProposalSQL, function (err, result) {
                //   if (err) {
                //     console.log(err)
                //     res.sendStatus(500)
                //   }
                //   res.status(200).json({
                //     message: 'success'
                //   })
                // })
              }
            })
          } else {
            db.Update('proposal', dataProposal, { id: proposalID }, function (err, result) {
              if (err) {
                console.log(err)
                res.sendStatus(500)
              }
              count += 1
              if (count === proposals.length) {
                db.Query(deleteProposalSQL, function (err, result) {
                  if (err) {
                    console.log(err)
                    res.sendStatus(500)
                  }
                  res.status(200).json({
                    message: 'success'
                  })
                })
              }
            })
          }
          if (data === proposals.length) {
            let deleteOrNot = false
            for (const n in result) {
              if (proposalIDList.includes(result[n].id) === false) {
                if (deleteOrNot) {
                  deleteProposalSQL += ', '
                }
                deleteProposalSQL += result[n].id
                deleteOrNot = true
              }
            }
            deleteProposalSQL += ')'
          }
        }
      })
    } else {
      res.sendStatus(403)
    }
  })
})

module.exports = router
