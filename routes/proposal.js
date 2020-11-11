const express = require('express');
const router = express.Router();
const db = require('../models/db');

//取得某特定議事的所有議案的提案單位名稱
router.get('/:delibrationID', function (req, res) {
    const id = req.params.delibrationID;
    db.Query('SELECT name FROM proposal WHERE delibrationID =' + id, function (result) {
        if (result.length == 0) {
            res.send("None");
        } else {
            res.json(result);
        }
    })
})

router.post('/voteResults', function (req, res) {
    const proposalID = req.body["proposalID"];
    const isAmendment = req.body["amendment"];
    let selectResultSql = "SELECT result FROM `vote` WHERE WHERE proposalID = " + proposalID + " and amendment = " + isAmendment;
    db.Query(selectResultSql, function (votes, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            let agree = 0,
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
            let agree_rate = Math.round(agree / total * 100) + "%";
            let disagree_rate = Math.round(disagree / total * 100) + "%";
            let spoil_rate = Math.round(spoil / total * 100) + "%";
            db.Query('SELECT cName FROM `case` WHERE caseID=' + CID, function (name) {
                let data = {
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
                res.status(400).send(data);
            })
        }
    })
})

//取得某特定議事的某特定議案的資料
router.get("/:delibrationID/:proposalID", function (req, res) {
    const condition = {
        "delibrationID": req.body["delibrationID"],
        "proposalID": req.body["proposalID"]
    };

    const cols = ["id", "dept", "reason", "description", "discussion"];

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
    const proposalID = req.body["proposalID"];
    const isAmendment = req.body["amendment"];
    let selectVoteSql = "SELECT studentID, result FROM `vote` WHERE proposalID = " + proposalID + " and amendment = " + isAmendment;
    db.Query(selectVoteSql, function (votesInfo, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            data = []
            for (let n in votesInfo) {
                // console.log(votesInfo[n])
                const column = ['department', 'uName'];
                db.FindbyColumn('user', column, { "studentID": votesInfo[n]["studentID"] }, function (userinfo, err) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(400);
                    } else {
                        studentVoteInfo = {
                            "index": parseInt(n) + 1,
                            "department": userinfo[0]["department"],
                            "name": userinfo[0]["uName"],
                            "voteResult": votesInfo[n]["result"]
                        }
                        // console.log("PPP: ", studentVoteInfo)
                        data.push(studentVoteInfo);

                        if (n == votesInfo.length - 1) {
                            res.status(200).send(data);
                        }
                    }
                })
            }
        }
    })
})

router.post('/voteAmendment', function (req, res) {
    const proposalID = req.body.proposalID;
    const studentID = req.body.studentID;
    const result = req.body.result;
    let voteResultSql = "INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( " + proposalID + ", '" + studentID + "', " + result + ", 1)";
    db.Query(voteResultSql, function (voteResult, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

router.post('/voteResolution', function (req, res) {
    const proposalID = req.body.proposalID;
    const studentID = req.body.studentID;
    const result = req.body.result;
    let voteResultSql = "INSERT INTO vote (proposalID, studentID, result, amendment) VALUES ( " + proposalID + ", '" + studentID + "', " + result + ", 0)";
    db.Query(voteResultSql, function (voteResult, err) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    });
});

//新增議案
router.post('/createProposal/:delibrationID', function (req, res) {
    const data = {
        "delibrationID": req.params.delibrationID,
        "dept": req.body.dept,
        "reason": req.body.reason,
        "description": req.body.description
    };

    db.Insert("proposal", data, function (err, result) {
        if (err) {
            console.log(err);
            res.status(403).send();
        }
        else {
            res.status(201).send();
        }
    })
})

//刪除議案
router.post('/deleteProposal/:proposalID', function (req, res) {
    const proposalID = req.params.proposalID;

    db.DeleteById('proposal', proposalID, function (err, result) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            res.sendStatus(200);
        }
    })
})

//儲存修改的議案
router.post('/saveEditProposals/:id', function (req, res) {
    const user_id = req.params.id;
    const proposals = req.body.proposal;

    db.FindbyColumn('user', ['position'], { 'id': user_id }, function (result) {
        if (result[0]["position"] == "leader") {
            for (let data in proposals) {
                let data_proposal = {
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


module.exports = router;