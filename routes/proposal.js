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
    } else {
      res.status(200).json(result)
    }
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
    } else {
      result[0].description = result[0].description.split('\n')
      res.status(200).send(result[0])
    }
  })
})

router.post('/voteResults', function (req, res) {
  const proposalID = req.body.proposalID
  const isAmendment = req.body.amendment
  const selectResultSql = 'SELECT result FROM `vote` WHERE proposalID = ' + proposalID + ' AND amendment = ' + isAmendment
  db.Query(selectResultSql, function (err, votes) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
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

router.post('/resultsList', function (req, res) {
  const proposalID = req.body.proposalID
  const isAmendment = req.body.amendment
  const selectVoteSql = 'SELECT studentID, result FROM `vote` WHERE proposalID = ' + proposalID + ' and amendment = ' + isAmendment
  db.Query(selectVoteSql, function (err, votesInfo) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      const data = []
      let count = 0
      for (const n in votesInfo) {
        const selectUserSql = 'SELECT department, name FROM `user` WHERE studentID = "' + votesInfo[n].studentID + '"'
        db.Query(selectUserSql, function (err, userinfo) {
          if (err) {
            console.log(err)
            res.sendStatus(500)
          } else {
            count += 1
            const studentVoteInfo = {
              index: parseInt(n) + 1,
              department: userinfo[0].department,
              name: userinfo[0].name,
              voteResult: votesInfo[n].result
            }
            // console.log("PPP: ", studentVoteInfo)
            data.push(studentVoteInfo)

            if (count === votesInfo.length) {
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
  const voteResultSql = 'INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( ' + proposalID + ', "' + studentID + '", ' + result + ', 1)'
  db.Query(voteResultSql, function (err, voteResult) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      res.status(200).json({
        message: 'success'
      })
    }
  })
})

router.post('/voteResolution', function (req, res) {
  const proposalID = req.body.proposalID
  const studentID = req.body.studentID
  const result = req.body.result
  const voteResultSql = 'INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( ' + proposalID + ', "' + studentID + '", ' + result + ', 0)'
  db.Query(voteResultSql, function (err, voteResult) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      res.status(200).json({
        message: 'success'
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
    } else {
      if (result.length !== 0) {
        const delibrationID = req.body.delibrationID
        const proposals = req.body.proposal
        const proposalIDList = []
        let proposalCount = 0
        for (const data in proposals) {
          const proposalID = proposals[data].proposalID
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
              proposalCount += 1
              if (proposalCount === proposals.length) {
                db.Query('SELECT id FROM `proposal` WHERE delibrationID = "' + delibrationID + '"', function (err, result) {
                  if (err) {
                    console.log(err)
                    res.sendStatus(500)
                  }
                  if (result.length === 0) {
                    res.status(200).json({
                      message: 'success'
                    })
                  } else {
                    let idCount = 0
                    for (const n in result) {
                      if (proposalIDList.includes(result[n].id)) {
                        idCount += 1
                        if (idCount === result.length) {
                          res.status(200).json({
                            message: 'success'
                          })
                        }
                      } else {
                        db.DeleteById('proposal', result[n].id, function (err) {
                          if (err) {
                            console.log(err)
                            res.sendStatus(500)
                          }
                          idCount += 1
                          if (idCount === result.length) {
                            res.status(200).json({
                              message: 'success'
                            })
                          }
                        })
                      }
                    }
                  }
                })
              }
            })
          } else {
            db.Update('proposal', dataProposal, { id: proposalID }, function (err, result) {
              if (err) {
                console.log(err)
                res.sendStatus(500)
              }
              proposalCount += 1
              if (proposalCount === proposals.length) {
                db.Query('SELECT id FROM `proposal` WHERE delibrationID = "' + delibrationID + '"', function (err, result) {
                  if (err) {
                    console.log(err)
                    res.sendStatus(500)
                  }
                  if (result.length === 0) {
                    res.status(200).json({
                      message: 'success'
                    })
                  } else {
                    let idCount = 0
                    for (const n in result) {
                      if (proposalIDList.includes(result[n].id)) {
                        idCount += 1
                        if (idCount === result.length) {
                          res.status(200).json({
                            message: 'success'
                          })
                        }
                      } else {
                        db.DeleteById('proposal', result[n].id, function (err) {
                          if (err) {
                            console.log(err)
                            res.sendStatus(500)
                          }
                          idCount += 1
                          if (idCount === result.length) {
                            res.status(200).json({
                              message: 'success'
                            })
                          }
                        })
                      }
                    }
                  }
                })
              }
            })
          }
        }
      } else {
        res.sendStatus(403)
      }
    }
  })
})

// 新增議案
// router.post('/createProposal', function (req, res) {
//   const studentID = req.session.studentID
//   db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
//     if (err) {
//       console.log(err)
//       res.sendStatus(500)
//     } else {
//       if (result.length !== 0) {
//         const data = {
//           delibrationID: req.body.delibrationID,
//           dept: req.body.dept,
//           reason: req.body.reason,
//           description: req.body.description,
//           discussion: req.body.discussion,
//           name: req.body.name
//           // isVoting在資料庫裡預設為0
//         }
//         db.Insert('proposal', data, function (err, result) {
//           if (err) {
//             console.log(err)
//             res.sendStatus(500)
//           } else {
//             res.status(200).json({
//               message: 'success'
//             })
//           }
//         })
//       } else {
//         res.sendStatus(403)
//       }
//     }
//   })
// })

// // 刪除議案
// router.post('/deleteProposal', function (req, res) {
//   const studentID = req.session.studentID
//   db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
//     if (err) {
//       console.log(err)
//       res.sendStatus(500)
//     } else {
//       if (result.length !== 0) {
//         const proposalID = req.body.proposalID
//         db.DeleteById('proposal', proposalID, function (err) {
//           if (err) {
//             console.log(err)
//             res.sendStatus(500)
//           } else {
//             res.status(200).json({
//               message: 'success'
//             })
//           }
//         })
//       } else {
//         res.sendStatus(403)
//       }
//     }
//   })
// })

module.exports = router
