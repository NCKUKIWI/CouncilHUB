var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.get('/', function (req, res) {
    var sql = 'SELECT * FROM delibration'
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
// /delibration/deleteDelibration/:id
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


router.get('/entry', function (req, res) {
    var id = req.body.delibrationID;
    var now = myDate.toLocaleString();
    db.Query('SELECT semester,period,dName,startTime,position FROM delibration WHERE delibrationID =' + id, function (result) {
        if (now >= result.startTime) {
            res.status(200).send("success");
            res.send(result);
        } else {
            res.status(403).send("fail");
        }
    })
})



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

router.get('/:position', function (req, res) {
    var position = req.params["position"].toString();
    var sql = "SELECT * FROM delibration WHERE position = " + position
    db.Query(sql, function (delibration) {
        if (delibration.length == 0) {
            res.sendStatus(204);
        } else {
            res.status(200).send(delibration);
        }
    });
})

router.post('/saveEditDelibration/:id', function (req, res) {

    user_id = req.params.id
    
    var data_delibration = {
        "dName": req.body.name,
        "createTime": req.body.createTime,
        "startTime": req.body.startTime,
        "endTime": req.body.endTime,
        "position": req.body.position,
        "semester": req.body.semester,
        "period": req.body.period,
    }

    var proposals = req.body.proposal

    db.FindbyColumn('user', ['position'], { 'id': user_id }, function (result) {

        if (result[0]["position"] == "leader") {
            db.Update('delibration', data_delibration, { "id": req.body.delibrationID }, function (err) {
                if (err) {
                    console.log(err);
                }
            })
            
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

router.get('/delibration/editDelibration/:id', function(req, res){
    var id = req.body.delibrationID;
    var cols = ["dName", "createTime", "startTime", "endTime", "position", "semester", "period"]
    var conditions = {
        "id": id
    }
    var data = {}

    db.FindbyColumn("delibration", cols, conditions, function (err, result) {
        if (err) {
            console.log(err);
            res.status(403).send("fail");
        } else {
            Object.assign(data, result);

            var cols = ["dept", "reason", "description", "discussion"]
            db.FindbyColumn("proposal", {"delibrationID": id}, cols, function(err, result){
                if (err){
                    console.log(err);
                    res.status(403).send("fail");
                } else {
                    data.proposal = result;
                    res.send(data);
                    console.log("success");
                    res.status(200).send("sucess");
                    }
            })
        }
    })
})



module.exports = router;