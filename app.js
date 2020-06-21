var express = require('express');
var app = express();
var bodyParser = require("body-parser");

var engine = require("ejs-locals"); //讓express支援layout
var path = require("path");//???
var fs = require("fs");//???



app.engine("ejs", engine);
app.set("views", path.join(__dirname, "views")); //view的路徑位在資料夾views中
app.set("view engine", "ejs"); //使用ejs作為template
app.use("/dist", express.static("dist", {
    maxAge: 24 * 60 * 60
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(require("./middleware"));
app.use("/user",require("./routes/user"));
app.use("/proposal",require("./routes/proposal"));
app.use("/delibration",require("./routes/delibration"));


app.get('/', function(req, res){
    res.send(render('./dist/index.html'));
})

function render(filename, params) {
    var data = fs.readFileSync(filename, 'utf8');
    for (var key in params) {
      data = data.replace('{' + key + '}', params[key]);
    }
    return data;
}

app.listen(3000, function(){
    console.log('Example app listening on port 3000!'); 
})