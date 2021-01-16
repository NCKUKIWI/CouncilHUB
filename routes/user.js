const express = require('express')
const router = express.Router()
const db = require('../models/db')

// 已測試
router.post('/signup', function (req, res, next) {
  const studentID = req.body.studentID

  try {
    db.Query('SELECT * FROM `user` WHERE studentID = "' + studentID + '"', function (err, result) {
      if (err) {
        res.status(500)
        return next(err)
      }
      if (result.length !== 0) {
        res.status(400).json({
          message: 'duplicated'
        })
      } else {
        const data = {
          studentID: studentID,
          department: req.body.department,
          grade: req.body.grade,
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
        }
        const positionArray = req.body.position
        const dataPosition = {
          studentID: studentID,
          name: ''
        }

        db.Insert('user', data, function (err, result) {
          if (err) {
            res.status(500)
            return next(err)
          }
          if (positionArray.length > 0) {
            let count = 0
            for (let i = 0; i < positionArray.length; i++) {
              dataPosition.name = positionArray[i]
              db.Insert('position', dataPosition, function (err, result) {
                if (err) {
                  res.status(500)
                  return next(err)
                }
                count += 1
                if (count === positionArray.length) {
                  res.status(200).json({
                    message: 'success'
                  })
                }
              })
            }
          } else {
            res.status(200).json({
              message: 'success'
            })
          }
        })
      }
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// 已測試
router.post('/login', function (req, res, next) {
  const ID = req.body.studentID
  const pw = req.body.password
  try {
    db.Query("SELECT password FROM `user` WHERE studentID = '" + ID + "'", function (err, password) {
      if (err) {
        res.status(500)
        return next(err)
      }
      console.log(password)
      if (password.length === 0) {
        res.status(200).json({
          message: 'not exist'
        })
      } else {
        if (pw === password[0].password) {
          db.Query("SELECT name FROM `position` WHERE studentID = '" + ID + "'", function (err, name) {
            if (err) {
              res.status(500)
              return next(err)
            }
            const data = {
              studentID: ID,
              isLeader: false
            }
            for (let i = 0; i < name.length; i++) {
              if (name[i].name === '議長') {
                data.isLeader = true
              }
            }
            req.session.studentID = ID
            res.status(200).send(data)
          })
        } else {
          res.sendStatus(403)
        }
      }
    })
  } catch (err) {
    res.status(500)
    return next(err)
  }
})

// router.post('/changeRole', function (req, res) {
//   const condition = {
//     studentID: req.body.studentID
//   }
//   const data = {
//     role: 4
//   }

//   db.Update('user', data, condition, function (err, result) {
//     if (err) {
//       console.log(err)
//       res.sendStatus(500)
//     }
//     res.sendStatus(200)
//   })
// })

// router.post('/deleteRole', function (req, res) {
//   const condition = {
//     studentID: req.body.studentID
//   }
//   const data = {
//     role: 0
//   }

//   db.Update('user', data, condition, function (err, result) {
//     if (err) {
//       console.log(err)
//       res.sendStatus(500)
//     }
//     res.sendStatus(200)
//   })
// })

module.exports = router
