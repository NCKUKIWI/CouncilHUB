var express = require('express');
var router = express.Router();
var db = require('../models/db');
var cache = require('../helper/cache');
var redis = cache.redis;
var delibrationCacheKey = cache.delibrationCacheKey;

//取得權限內議事內容
router.get('/', function (req, res) {
    var studentID = req.session.studentID;
    if(studentID){
        redis.get(delibrationCacheKey(studentID), function(err, reply){
            if(reply){
	        var data = JSON.parse(reply);
	        //console.log("redis read success");
	        res.status(200).send(data);
            } else {
                db.Query('select * from position where studentID = "' + studentID + '";', function(positionResult, err){
                    if(err) throw err;
                    if(positionResult.length == 0){
                        db.Query('select * from delibration where position is null;', function(delibrationResult, err){
                            if(err){
                                console.log(err);
                                res.status(403).send("err");
                            } else {
                                redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult));
                                res.status(200).send(delibrationResult);
                            }
                        })
                    } else {
                        sql = 'select * from delibration where position in (';
                        console.log("position result: " + positionResult); 
                        for(let n in positionResult){
                        console.log("index:" + n + ", position:" + positionResult[n].name + "\n");
                        sql = sql + '"'  + positionResult[n]["name"] + '"';
                        if(n == positionResult.length-1){
                            sql = sql + ')';
                        } else {
                            sql = sql + ',';
                        }
                    }
                    sql = sql + " or position is null;";
                    //console.log(sql);
                        db.Query(sql, function(delibrationResult){
                        if(err){
                            console.log(err);
                            res.status(403).send("err");
                        } else {
                                redis.set(delibrationCacheKey(studentID), JSON.stringify(delibrationResult));
                                res.status(200).send(delibrationResult);
                            }
                        })
                    }
                })
            }
        })
    } else {
        res.redirect('/');
    }
})

//議長取得所有議事內容
router.get('/leader', function (req, res) {
    var sql = "SELECT * FROM delibration order by startTime DESC";
    db.Query(sql, function (delibrations, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.status(200).send(delibrations);
        }
    });
})

//刪除議事
router.post('/deleteDelibration/:delibrationID', function (req, res) {

    delibration_id = req.params.delibrationID;

    db.DeleteById('delibration', delibration_id, function (err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(400);

        } else {
            res.sendStatus(200);
        }
    })
})

//新增議事
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
                res.sendStatus(400);
            } else {
                res.sendStatus(201);
            }
        })
    } else {
        res.sendStatus(400);
    }
})

//儲存修改的議事
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
                    res.sendStatus(400);
                } else {
                    res.sendStatus(201);
                }
            })
        } 
        else {
            res.sendStatus(403);
        }
    })
})

//儲存修改的議案
router.post('/saveEditProposals/:id', function (req, res) {
    var user_id = req.params.id;
    var proposals = req.body.proposal;

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
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(201);
                    }
                })
            }
        } 
        else {
            res.sendStatus(403);
        }
    })
})

//取得當前意識下的所有議案供修改
router.post('/editProposals/:id', function(req, res){
    var user_id = req.params.id;
    var delibrationID = req.body.delibrationID;

    db.FindbyColumn('user', ['position'], { 'id': user_id }, function (result) {
        if (result[0]["position"] == "leader") {
            var sql = "SELECT * FROM proposal where delibrationID = '" + delibrationID + "'";
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
            res.sendStatus(403);
        }
    })
    
})


module.exports = router;
