var express = require('express');
var router = express.Router();
var db = require('../models/db');
var cache = require('../helper/cache');
var redis = cache.redis;
var delibrationCacheKey = cache.delibrationCacheKey;

router.get('/:studentID', function (req, res) {
    var studentID = req.params.studentID;
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
