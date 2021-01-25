const express = require('express')
const router = express.Router()
const db = require('../models/db')
const cache = require('../helper/cache')
const redis = cache.redis
const delibrationCacheKey = cache.delibrationCacheKey

// 已測試
// 取得權限內議事內容
router.get('/', function (req, res, next) {
  const studentID = req.session.studentID
  try {
    if (studentID) {
      redis.get(delibrationCacheKey(studentID), function (err, reply) {
        if (err) {
          res.status(500)
          return next(err)
        }
        if (reply) {
          const data = JSON.parse(reply)
          res.status(200).send(data)
        } else {
          db.Query('select * from position where studentID = "' + studentID + '";', function (err, positionResult) {
            if (err) {
              res.status(500)
              return next(err)
            }
            if (positionResult.length === 0) {
              db.Query('select * from delibration where position is null and startTime <= current_date and endTime >= current_date;', function (err, delibrationResult) {
                if (err) {
                  res.status(500)
                  return next(err)
                }
                redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult))
                res.status(200).send(delibrationResult)
              })
            } else {
              let sql = 'select * from delibration where position in ('
              console.log('position result: ' + positionResult)
              for (const n in positionResult) {
                console.log('index:' + n + ', position:' + positionResult[n].name + '\n')
                sql = sql + '"' + positionResult[n].name + '"'
                if (parseInt(n) === positionResult.length - 1) {
                  sql = sql + ')'
                } else {
                  sql = sql + ','
                }
              }
              sql = sql + ' or position is null and startTime <= current_date and endTime >= current_date;'
              // console.log(sql);
              db.Query(sql, function (err, delibrationResult) {
                if (err) {
                  res.status(500)
                  return next(err)
                }
                redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult))
                res.status(200).send(delibrationResult)
              })
            }
          })
        }
      })
    } else {
      res.redirect('/')
    }
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// 已測試
// 議長取得所有議事內容
router.get('/leader', function (req, res, next) {
  try {
    db.Query('SELECT * FROM delibration order by startTime DESC', function (err, delibrations) {
      if (err) {
        res.status(500)
        return next(err)
      }
      res.status(200).send(delibrations)
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// 已測試
// 刪除議事
router.delete('/deleteDelibration', function (req, res, next) {
  const studentID = req.session.studentID
  try {
    db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      if (result.length !== 0) {
        const delibrationID = req.body.delibrationID
        db.DeleteById('delibration', delibrationID, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          db.Query('DELETE FROM `proposal` WHERE delibrationID = ' + delibrationID, function (err, result) {
            if (err) {
              res.status(500)
              return next(err)
            }
            redis.flushdb(function (err, succeeded) {
              if (err) {
                res.status(500)
                return next(err)
              }
              res.status(200).json({
                message: 'success'
              })
            })
          })
        })
      } else {
        res.sendStatus(403)
      }
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// 已測試
// 新增議事
router.post('/createDelibration', function (req, res, next) {
  const studentID = req.session.studentID
  try {
    db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      if (result.length !== 0) {
        const data = {
          dName: req.body.dName,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          position: req.body.position ? req.body.position : null,
          semester: req.body.semester,
          period: req.body.period
        }
        db.Insert('delibration', data, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          redis.flushdb(function (err, succeeded) {
            if (err) {
              res.status(500)
              return next(err)
            }
            res.status(200).json({
              message: 'success'
            })
          })
        })
      } else {
        res.sendStatus(403)
      }
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// 已測試
// 儲存修改的議事
router.post('/saveEditDelibration', function (req, res, next) {
  const studentID = req.session.studentID
  try {
    db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      if (result.length !== 0) {
        if (!req.body.delibrationID || !req.body.dName || !req.body.startTime || !req.body.endTime || !req.body.position || !req.body.semester || !req.body.period) {
          return res.sendStatus(400)
        }
        const dataDelibration = {
          dName: req.body.dName,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          position: req.body.position,
          semester: req.body.semester,
          period: req.body.period
        }
        db.Update('delibration', dataDelibration, { id: req.body.delibrationID }, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          redis.flushdb(function (err, succeeded) {
            if (err) {
              res.status(500)
              return next(err)
            }
            res.status(200).json({
              message: 'success'
            })
          })
        })
      } else {
        res.sendStatus(403)
      }
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// 已測試
// 取得當前議事下的所有議案供修改
router.get('/editProposals/:delibrationID', function (req, res, next) {
  const studentID = req.session.studentID
  try {
    db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      if (result.length !== 0) {
        const delibrationID = req.params.delibrationID
        db.Query('SELECT * FROM proposal where delibrationID = "' + delibrationID + '"', function (err, proposals) {
          if (err) {
            res.status(500)
            return next(err)
          }
          res.status(200).send(proposals)
        })
      } else {
        res.sendStatus(403)
      }
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

module.exports = router
