var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var cache = require("./helper/cache");
var redisHelper = cache.redis
var socket = require('socket.io');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    cookie: {
        maxAge: 1000*60*60*24
    },
    secret: "secret",
    sevaUninitialized: true,
    resave: true,
    store: new RedisStore({
	    client: redisHelper
    })
}))

var http = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})
var io = socket(http);

app.get('/', function (req, res) {
    res.send('Hello World!');
})

app.use("/user", require("./routes/user"));
app.use("/proposal", require("./routes/proposal"));
app.use("/delibration", require("./routes/delibration"));

io.on('connection', (socket) => {

    socket.on('entryVote', (msg) => { //點進議案觸發
        var proposalID = msg.proposalID;
        var insertSql = "SELECT isVoting FROM `proposal` WHERE proposalID = " + proposalID;
        db.Query(insertSql, function (voteInfo, err) {
            var isVoting = voteInfo[0]["isVoting"];
            if (isVoting === 0) {
                io.emit('closeVote', "投票結束囉"); // 告訴大家
            } else if (isVoting === 1) {
                io.emit('startResolutionVote', "開始決議案投票"); // 告訴大家
            } else if (isVoting === 2) {
                io.emit('startAmendmentVote', "開始修正案投票"); // 告訴大家
            }
        })
    });


    socket.on('startResolution', (msg) => { //議長觸發
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 1 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('startResolutionVote', "開始決議案投票"); // 告訴大家
        })
    });
    socket.on('closeResolution', (msg) => { //議長觸發
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 0 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('closeResolutionVote', "決議案投票結束"); // 告訴大家
        })
    });


    socket.on('startAmendment', (msg) => {
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 2 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('startAmendmentVote', "開始修正案投票");
        })
    });
    socket.on('closeAmendment', (msg) => {
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 0 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('closeAmendmentVote', "修正案投票結束"); // 同意不同意關掉
        })
        // 如果同意>反對 議長自己去改資料XD
    });
});
