const express = require('express')
const router = express.Router()
const db = require('../models/db')
// const delibrationCacheKey = cache.delibrationCacheKey

// // 取得權限內議事內容
// router.get('/', function (req, res) {
//   const studentID = req.session.studentID
//   if (studentID) {
//     redis.get(delibrationCacheKey(studentID), function (err, reply) {
//       if (reply) {
//         const data = JSON.parse(reply)
//         // console.log("redis read success");
//         res.status(200).send(data)
//       } else {
//         db.Query('select * from position where studentID = "' + studentID + '";', function (positionResult, err) {
//           if (err) throw err
//           if (positionResult.length === 0) {
//             db.Query('select * from delibration where position is null;', function (delibrationResult, err) {
//               if (err) {
//                 console.log(err)
//                 res.status(403).send('err')
//               } else {
//                 redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult))
//                 res.status(200).send(delibrationResult)
//               }
//             })
//           } else {
//             let sql = 'select * from delibration where position in ('
//             console.log('position result: ' + positionResult)
//             for (const n in positionResult) {
//               console.log('index:' + n + ', position:' + positionResult[n].name + '\n')
//               sql = sql + '"' + positionResult[n].name + '"'
//               if (n === positionResult.length - 1) {
//                 sql = sql + ')'
//               } else {
//                 sql = sql + ','
//               }
//             }
//             sql = sql + ' or position is null;'
//             // console.log(sql);
//             db.Query(sql, function (delibrationResult) {
//               if (err) {
//                 console.log(err)
//                 res.status(403).send('err')
//               } else {
//                 redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult))
//                 res.status(200).send(delibrationResult)
//               }
//             })
//           }
//         })
//       }
//     })
//   } else {
//     res.redirect('/')
//   }
// })

// 已測試
// 議長取得所有議事內容
router.get('/leader', function (req, res) {
  const sql = 'SELECT * FROM delibration order by startTime DESC'
  db.Query(sql, function (delibrations, err) {
    if (err) {
      console.log(err)
      res.sendStatus(400)
    } else {
      res.status(200).send(delibrations)
    }
  })
})

// 已測試
// 刪除議事
router.post('/deleteDelibration', function (req, res) {
  const delibrationID = req.body.delibrationID

  db.DeleteById('delibration', delibrationID, function (err, result) {
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

// 已測試
// 新增議事
router.post('/createDelibration', function (req, res) {
  // var startTime = moment(data.myTime.format(req.body["startTime"])).toISOString();

  if (req.body.dName && req.body.startTime && req.body.endTime && req.body.position && req.body.semester && req.body.period) {
    const data = {
      dName: req.body.dName,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      position: req.body.position,
      semester: req.body.semester,
      period: req.body.period
    }

    // myDate = moment(data.myTime.format('YYYY/MM/DD HH:MM:SS')).toISOString();

    db.Insert('delibration', data, function (err, result) {
      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.status(200).json({
          message: 'success'
        })
      }
    })
  } else {
    res.sendStatus(400)
  }
})

// 已測試
// 儲存修改的議事
router.post('/saveEditDelibration/:id', function (req, res) {
  const studentID = req.params.id

  db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (result, err) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      if (result.length !== 0) {
        const dataDelibration = {
          dName: req.body.dName,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          position: req.body.position,
          semester: req.body.semester,
          period: req.body.period
        }
        db.Update('delibration', dataDelibration, { id: req.body.delibrationID }, function (result) {
          res.status(200).json({
            message: 'success'
          })
        })
      } else {
        res.sendStatus(403)
      }
    }
  })
})

// 已測試
// 取得當前議事下的所有議案供修改
router.post('/editProposals/:id', function (req, res) {
  const studentID = req.params.id

  db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (result, err) {
    if (err) {
      console.log(err)
      res.sendStatus(500)
    } else {
      if (result.length !== 0) {
        const delibrationID = req.body.delibrationID
        db.Query('SELECT * FROM proposal where delibrationID = "' + delibrationID + '"', function (proposals, err) {
          if (err) {
            console.log(err)
            res.sendStatus(500)
          } else {
            if (proposals.length === 0) {
              res.status(404).json({
                message: 'Cannnot find'
              })
            } else {
              res.status(200).send(proposals)
            }
          }
        })
      } else {
        res.sendStatus(403)
      }
    }
  })
})

module.exports = router
