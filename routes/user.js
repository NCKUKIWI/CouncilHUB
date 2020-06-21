var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.post('/signup', function (req, res) {
    var data = {
        "studentID": req.body["studentID"],
        "department": req.body["department"],
        "grade": req.body["grade"],
        "email": req.body["email"],
        "name": req.body["name"],
        "password": req.body["password"],
        "position": req.body["position"]
    }

    console.log(data);

    db.Insert("user", data, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send("fail");
        } else {
            res.status(200).send("success");
        }
    })
})

router.post('/login', function (req, res) {
    var ID = req.body.studentID;
    var pw = req.body.password;


    db.Query("SELECT password, position FROM `user` WHERE studentID='" + ID + "'", function (result, err) {
        if (err) {
            console.log(err);
        } else {
            if (pw == result[0]["password"]) {
                var data = {
                    "studentID": ID,
                    "position": result[0].position
                }
                res.status(200).send(data);
            } else {
                res.sendStatus(403);
            }
        }
    })
})

router.post('/changeRole', function(req, res){
    var condition = {
        "studentID": req.body["studentID"]
    };
    var data = {
        "role": 4
    }
    
    db.Update('user', data, condition, function(err, result){
        if (err){
            console.log(err)
            res.status(400).send("fail");
        }else{
            console.log("Update success")
            res.status(200).send("sucess");
        }
    })
})

router.post('/deleteRole', function(req, res){
    var condition = {
        "studentID": req.body["studentID"]
    };
    var data = {
        "role": 0
    }
    
    db.Update('user', data, condition, function(err, result){
        if (err){
            console.log(err)
            res.status(400).send("fail");
        }else{
            console.log("Update success")
            res.status(200).send("sucess");
        }
    })
})

module.exports = router;