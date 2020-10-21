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
    // 去資料庫搜尋投票是否開始
    if (isVoting === true) {
        io.emit('start vote', "開始投票囉"); // 告訴大家
    } else if (isVoting === false) {
        io.emit('close vote', "開始投票囉"); // 告訴大家
    }

    socket.on('start vote', (msg) => { //議長觸發
        io.broadcast.emit('start vote', "開始投票囉"); // 告訴大家
    });
    socket.on('close vote', (msg) => { //議長觸發
        io.broadcast.emit('close vote', "沒投票囉"); // 告訴大家
    });


    socket.on('要投臨時動議囉', (msg) => {
        io.broadcast.emit('臨時動議同意案');
    });
    socket.on('要關臨時動議囉', (msg) => {
        io.broadcast.emit('同意不同意關掉');
        // 如果同意>反對 議長去改資料
    });
});