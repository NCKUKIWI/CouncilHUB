var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.post('/signup', function (req, res) {
    var studentID = req.body["studentID"];
    var data = {
        "studentID": studentID,
        "department": req.body["department"],
        "grade": req.body["grade"],
        "email": req.body["email"],
        "name": req.body["name"],
        "password": req.body["password"],
    };
    var positionArray = req.body["position"];
    var data_position = {
        "studentID": studentID,
        "name": ""
    };

    db.Insert("user", data, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400).send("fail");
        } else {
            if(positionArray.length > 0){
                for(var i = 0; i<positionArray.length; i++){
                    data_position.name = positionArray[i];
                    db.Insert("position", data_position, function (err, result) {
                        if (err) {
                            console.log(err);
                            res.sendStatus(400);
                        }
                        if (i = positionArray.length-1){
                            res.sendStatus(200);
                        }
                    })    
                }
            }
            else{
                res.sendStatus(200);
            }
        }
    })
})

router.post('/login', function (req, res) {
    var ID = req.body.studentID;
    var pw = req.body.password;
    db.Query("SELECT password FROM `user` WHERE studentID='" + ID + "'", function (password, err) {
	console.log(password.length);
        if (err) {
            console.log(err);
        } else if(password.length == 0){
	    res.status(200).send("unexist");
	} else {
            if (pw == password[0]["password"]) {
                db.Query("SELECT name FROM `position` WHERE studentID ='" + ID + "'", function (name, err) {
                    var data = {
                        "studentID": ID,
                        "isLeader": false
                    }
                    for(var i=0; i<name.length; i++){
                        if(name[i]["name"] == "議長"){
                            data.isLeader = true;
                        }
                    }
		    req.session.studentID = ID;
                    res.status(200).send(data);
                })
            } else {
                res.sendStatus(403);
            }
        }
    })
})

// router.post('/changeRole', function(req, res){
//     var condition = {
//         "studentID": req.body["studentID"]
//     };
//     var data = {
//         "role": 4
//     }
    
//     db.Update('user', data, condition, function(err, result){
//         if (err){
//             console.log(err);
//             res.sendStatus(400);
//         }else{
//             res.sendStatus(200);
//         }
//     })
// })

// router.post('/deleteRole', function(req, res){
//     var condition = {
//         "studentID": req.body["studentID"]
//     };
//     var data = {
//         "role": 0
//     }
    
//     db.Update('user', data, condition, function(err, result){
//         if (err){
//             console.log(err);
//             res.sendStatus(400);
//         }else{
//             res.sendStatus(200);
//         }
//     })
// })


module.exports = router;