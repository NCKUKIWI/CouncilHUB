var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var Server = require('socket.io');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.get('/', function (req, res) {
    res.send('Hello World!');
})


app.use("/user", require("./routes/user"));
app.use("/proposal", require("./routes/proposal"));
app.use("/delibration", require("./routes/delibration"));


const server = app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
})


const io = Server(server);

io.on('connection', (socket) => {

    socket.on('entry vote', (msg) => { //點進議案觸發
        var proposalID = msg.proposalID;
        var insertSql = "SELECT isVoting FROM `proposal` WHERE proposalID = " + proposalID;
        db.Query(insertSql, function (voteInfo, err) {
            var isVoting = voteInfo[0]["isVoting"];
            if (isVoting === 0) {
                io.emit('close vote', "投票結束囉"); // 告訴大家
            } else if (isVoting === 1) {
                io.emit('close vote', "開始決議案投票"); // 告訴大家
            } else if (isVoting === 2) {
                io.emit('close vote', "開始修正動議投票"); // 告訴大家
            }
        })
    });


    socket.on('start vote', (msg) => { //議長觸發
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 1 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('start vote', "開始決議案投票"); // 告訴大家
        })
    });
    socket.on('close vote', (msg) => { //議長觸發
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 0 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('close vote', "投票結束囉"); // 告訴大家
        })
    });


    socket.on('要投修正動議囉', (msg) => {
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 2 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('開始修正動議投票');
        })
    });
    socket.on('要關修正動議囉', (msg) => {
        var proposalID = msg.proposalID;
        var updateSql = "UPDATE `proposal` SET isVoting = 0 WHERE proposalID = " + proposalID;
        db.Query(updateSql, function (updateResult, err) {
            io.broadcast.emit('close vote', "投票結束囉"); // 同意不同意關掉
        })
        // 如果同意>反對 議長自己去改資料XD
    });
});