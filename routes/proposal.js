var express = require('express');
var router = express.Router();
var db = require('../models/db');

router.get('/:delibrationID', function (req, res) {
    var id = req.params.delibrationID;
    db.Query('SELECT name FROM proposal WHERE delibrationID =' + id, function (result) {
        if (result.length == 0) {
            res.send("None");
        } else {
            res.json(result);
        }
    })
})

// router.get('/createVote', function (req, res) {
//     var cName = req.body.cName;
//     var dID = req.body.delibrationID;
//     var pID = req.body.proposalID;
//     db.Query('INSERT case (cName,delibrationID,proposalID) VALUES (' + cName + ',' + dID + ',' + pID + ')', function (result) {
//         res.send({
//             caseID: result.insertID,
//             cName: cName
//         });
//     })
// })


router.post('/voteResults', function (req, res) {
    //重構(資料庫改)
    var CID = req.body.caseID;
    db.Query('SELECT result FROM `vote` WHERE caseID=' + CID, function (votes, err) {
        if (err) {
            console.log(err);
        } else {
            var agree = 0,
                disagree = 0,
                spoil = 0,
                total = 0;
            for (let n in votes) {
                console.log(votes[n])
                total = total + 1;
                if (votes[n]["result"] == 1) {
                    agree = agree + 1;
                }
                if (votes[n]["result"] == 2) {
                    disagree = disagree + 1;
                }
                if (votes[n]["result"] == 3) {
                    spoil = spoil + 1;
                }
            }
            var agree_rate = Math.round(agree / total * 100) + "%";
            var disagree_rate = Math.round(disagree / total * 100) + "%";
            var spoil_rate = Math.round(spoil / total * 100) + "%";
            db.Query('SELECT cName FROM `case` WHERE caseID=' + CID, function (name) {
                var data = {
                    "agree": {
                        "caseName": name[0]["result"],
                        "result": "同意",
                        "vote": agree + "票",
                        "percent": agree_rate
                    },
                    "disagree": {
                        "caseName": name[0]["result"],
                        "result": "不同意",
                        "vote": disagree + "票",
                        "percent": disagree_rate
                    },
                    "void": {
                        "caseName": name[0]["result"],
                        "result": "廢票",
                        "vote": spoil + "票",
                        "percent": spoil_rate
                    }
                };
                res.json(data);
            })
        }
    })
})

router.get("/:delibrationID/:proposalID", function (req, res) {
    var condition = {
        "delibrationID": req.body["delibrationID"],
        "proposalID": req.body["proposalID"]
    };

    var cols = ["dept", "reason", "description", "discussion"];

    db.FindbyColumn("proposal", cols, condition, function (err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.status(200).send(result);
        }
    })
})

router.post('/resultsList', function (req, res) {
    //重構(資料庫改)
    var CID = req.body["caseID"];
    db.Query('SELECT studentID, result FROM `vote` WHERE caseID=' + CID, function (votesInfo, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400)
        } else {
            data = []
            for (let n in votesInfo) {
                // console.log(votesInfo[n])

                var column = ['department', 'uName'];
                db.FindbyColumn('user', column, {
                    "studentID": votesInfo[n]["studentID"]
                }, function (userinfo, err) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(400)
                    } else {
                        studentVoteInfo = {
                            "index": parseInt(n) + 1,
                            "department": userinfo[0]["department"],
                            "name": userinfo[0]["uName"],
                            "voteResult": votesInfo[n]["result"]
                        }
                        // console.log("PPP: ", studentVoteInfo)
                        data.push(studentVoteInfo)

                        if (n == votesInfo.length - 1)
                            // res.send(data)
                            res.status(200).send(data)
                    }

                })
            }
        }
    })
})

router.post('/vote', function (req, res) {
    //重構(資料庫改)
    var caseID = req.body.caseID;
    var studentID = req.body.studentID;
    var result = req.body.result;
    var voteResultSql = "INSERT INTO vote (caseID, studentID, result) VALUES ( " + caseID + ", '" + studentID + "', " + result + ")";
    db.Query(voteResultSql, function (voteResult, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.status(200).send("vote success");
        }
    });
});

// router.post('/createProposal', function (req, res) {

//     if (req.body["delibrationID"] && req.body["dept"]) {
//         var data = {
//             "delibrationID": req.body["delibrationID"],
//             "dept": req.body["dept"],
//             "reason": req.body["reason"],
//             "description": req.body["description"],
//             "discussion": req.body["discussion"],
//             "name": req.body["name"]
//         }

//         db.Insert('proposal', data, function (err, result) {
//             if (err) {
//                 console.log(err);
//                 // res.send({
//                 //     create: "fail"
//                 // });
//                 res.sendStatus(403)

//             } else {
//                 res.sendStatus(201)
//             }
//         })
//     } else {
//         res.sendStatus(400)
//     }
// })

// router.post('/save/:delibrationid', function (req, res) {
//     var delibrationID = req.params.delibrationid;
//     var dept = req.body.dept;
//     var reason = req.body.reason;
//     var description = req.body.description;
//     var data = {
//         "delibrationID": delibrationID,
//         "dept": dept,
//         "reason": reason,
//         "description": description
//     }

//     db.Insert("proposal", data, function (err, result) {
//         if (err) {
//             console.log(err);
//             res.status(403).send();
//         }
//         else {
//             res.status(201).send();
//         }
//     })

//     //res.status(201).send();
//     //status 要 send res才會出去
// })

module.exports = router;