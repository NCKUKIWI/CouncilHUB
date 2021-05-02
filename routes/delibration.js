// 代碼導入Express應用程序對象，並使它獲取一個Router對象
// Router 實例是一個完整的中介軟體與路由系統
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
    // 是否有取得要查詢的ID，若否重新導向
    if (studentID) {
      // 去得到elibrationCacheKey(studentID)這個KEY的值
      redis.get(delibrationCacheKey(studentID), function (err, reply) {
        if (err) {
          // res.status()設置響應的HTTP狀態 , 500:Internal Server Error
          res.status(500)
          return next(err)
        }
        // 如果redis已有資料在
        if (reply) {
          const data = JSON.parse(reply)
          // 200:ok
          res.status(200).send(data)
        } else {
          // 去原先資料庫查詢其職位
          db.Query('select * from position where studentID = "' + studentID + '";', function (err, positionResult) {
            if (err) {
              res.status(500)
              return next(err)
            }
            // 如果沒職位
            if (positionResult.length === 0) {
              // 找出無權限的議事內容(已開始且尚未結束的議程)
              db.Query('select * from delibration where position is null and startTime <= current_date and endTime >= current_date;', function (err, delibrationResult) {
                if (err) {
                  res.status(500)
                  return next(err)
                }
                // 設定delibrationCacheKey(studentID)這個key去抓取value(無權限的議事內容)
                redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult))
                res.status(200).send(delibrationResult)
              })
            }
            // 有職位的話 
            else {
              let sql = 'select * from delibration where position in ('
              console.log('position result: ' + positionResult)
              // 一個人可能有多職位
              for (const n in positionResult) {
                console.log('index:' + n + ', position:' + positionResult[n].name + '\n')
                sql = sql + '"' + positionResult[n].name + '"'
                if (parseInt(n) === positionResult.length - 1) {
                  sql = sql + ')'
                } else {
                  sql = sql + ','
                }
              }
              // 找出符合其職位權限以及無權限的議事內容 
              sql = sql + ' or position is null and startTime <= current_date and endTime >= current_date;'
              console.log(sql);
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
    // 議長可取得所有議事內容(造時間順序排)
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
    // 找出議長資料
    db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      // 如果有回傳資料
      if (result.length !== 0) {
        const delibrationID = req.body.delibrationID
        // 從db刪除資料
        db.DeleteById('delibration', delibrationID, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          // 刪除此議事
          db.Query('DELETE FROM `proposal` WHERE delibrationID = ' + delibrationID, function (err, result) {
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
        // Forbidden 客戶端錯誤狀態碼表示伺服器理解該請求但拒絕核准，權限不足
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
    // 找出議長資料
    db.Query('SELECT name FROM `position` WHERE studentID = "' + studentID + '" AND name = "議長"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      if (result.length !== 0) {
        // 欲新增議事的資料
        const data = {
          dName: req.body.dName,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          // 類似if/else, true回傳前面, false回傳後面
          position: req.body.position ? req.body.position : null,
          semester: req.body.semester,
          period: req.body.period
        }
        // 插入資料庫
        db.Insert('delibration', data, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          res.status(200).json({
            message: 'success'
          })
        })
      } else {
        // Forbidden 客戶端錯誤狀態碼表示伺服器理解該請求但拒絕核准，權限不足
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
        //看資料是否有缺
        if (!req.body.delibrationID || !req.body.dName || !req.body.startTime || !req.body.endTime || !req.body.position || !req.body.semester || !req.body.period) {
          // bad request, 資料錯誤或是有缺少，應該修改過資料再重新要求
          return res.sendStatus(400)
        }
        //欲更新的資料
        const dataDelibration = {
          dName: req.body.dName,
          startTime: req.body.startTime,
          endTime: req.body.endTime,
          position: req.body.position,
          semester: req.body.semester,
          period: req.body.period
        }
        //更新資料庫
        db.Update('delibration', dataDelibration, { id: req.body.delibrationID }, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          res.status(200).json({
            message: 'success'
          })
        })
      } else {
        // Forbidden 客戶端錯誤狀態碼表示伺服器理解該請求但拒絕核准，權限不足
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
        // 找出符合此議事ID的議事
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
// 所有模塊的最後一個導出路由器Router對象
module.exports = router
