var express = require('express');
var app = express();
var bodyParser = require("body-parser");

app.get('/', function(req, res){
    res.send('Hello World!');
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use("/user",require("./routes/user"));
app.use("/proposal",require("./routes/proposal"));
app.use("/delibration",require("./routes/delibration"));

app.listen(3000, function(){
    console.log('Example app listening on port 3000!'); 
})