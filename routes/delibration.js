var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.get('/', function (req, res) {
    var studentID = req.body["studentID"];
    db.Query("SELECT name FROM `position` WHERE studentID ='" + studentID + "'", function (name, err) {
        var filter = "";
        for(var i=0; i<name.length; i++){
            if(i>0){
                filter += ","
            }
            filter += "'" + name[i]["name"] + "'";
        }
        var sql = "SELECT * FROM delibration where position in (" + filter + ")";
        db.Query(sql, function (delibration, err) {
            if (err) {
                console.log(err);
                res.sendStatus(400);
            } else {
                if (delibration.length == 0) {
                    res.status(404).send("Cannnot find.");
                } else {
                    res.status(200).send(delibration);
                }
            }
        });
    })
})

router.get('/leader', function (req, res) {
    var sql = "SELECT * FROM delibration order by startTime DESC";
    db.Query(sql, function (delibrations, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            if (delibration.length == 0) {
                res.status(404).send("Cannnot find.");
            } else {
                res.status(200).send(delibrations);
            }
        }
    });
})


router.post('/deleteDelibration/:delibrationID', function (req, res) {

    delibration_id = req.params.delibrationID

    db.DeleteById('delibration', delibration_id, function (err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(403);

        } else {
            res.status(200).send("success");
        }
    })
})


// router.get('/entry', function (req, res) {
//     var id = req.body.delibrationID;
//     var now = myDate.toLocaleString();
//     db.Query('SELECT semester,period,dName,startTime,position FROM delibration WHERE delibrationID =' + id, function (result) {
//         if (now >= result.startTime) {
//             res.status(200).send("success");
//             res.send(result);
//         } else {
//             res.status(403).send("fail");
//         }
//     })
// })


router.post('/createDelibration', function (req, res) {

    // var startTime = moment(data.myTime.format(req.body["startTime"])).toISOString();

    if (req.body["dName"] && req.body["startTime"] && req.body["position"] && req.body["semester"] && req.body["period"]) {
        var data = {
            "dName": req.body["dName"],
            "startTime": req.body["startTime"],
            "position": req.body["position"],
            "semester": req.body["semester"],
            "period": req.body["period"],
        }

        // myDate = moment(data.myTime.format('YYYY/MM/DD HH:MM:SS')).toISOString();

        db.Insert('delibration', data, function (err, result) {
            if (err) {
                console.log(err);
                res.sendStatus(403)
            } else {
                res.sendStatus(201)
            }
        })
    } else {
        res.sendStatus(400)
    }
})

router.post('/saveEditDelibration/:id', function (req, res) {
    var user_id = req.params.id
    
    var data_delibration = {
        "dName": req.body.name,
        "createTime": req.body.createTime,
        "startTime": req.body.startTime,
        "endTime": req.body.endTime,
        "position": req.body.position,
        "semester": req.body.semester,
        "period": req.body.period,
    }

    db.FindbyColumn('user', ['position'], { 'id': user_id }, function (result) {

        if (result[0]["position"] == "leader") {
            db.Update('delibration', data_delibration, { "id": req.body.delibrationID }, function (err) {
                if (err) {
                    console.log(err);
                }
            })
            res.sendStatus(201)
        } 
        else {
            res.sendStatus(400)
        }
    })
})


router.post('/saveEditProposals/:id', function (req, res) {
    var user_id = req.params.id
    var proposals = req.body.proposal

    db.FindbyColumn('user', ['position'], { 'id': user_id }, function (result) {
        if (result[0]["position"] == "leader") {
            for (var data in proposals) { 
                var data_proposal = {
                    "dept": proposals[data]["dept"],
                    "reason": proposals[data]["reason"],
                    "description": proposals[data]["description"],
                    "discussion": proposals[data]["discussion"]
                }
        
                db.Update('proposal', data_proposal, { "id": proposals[data]["proposalID"] }, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            }
            res.sendStatus(201)
        } 
        else {
            res.sendStatus(400)
        }
    })
})

router.get('/editProposals/:id', function(req, res){
    var user_id = req.params.id
    var delibrationID = req.body.delibrationID;

    db.FindbyColumn('user', ['position'], { 'id': user_id }, function (result) {
        if (result[0]["position"] == "leader") {
            var sql = "SELECT * FROM proposal where delibrationID = '" + delibrationID + "'"
            db.Query(sql, function (proposals, err) {
                if (err) {
                    console.log(err);
                    res.sendStatus(400);
                } else {
                    if (proposals.length == 0) {
                        res.status(404).send("Cannnot find.");
                    } else {
                        res.status(200).send(proposals);
                    }
                }
            });
        } 
        else {
            res.sendStatus(400)
        }
    })
    
})

module.exports = router;