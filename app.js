var express = require('express');
var app = express();
var bodyParser = require("body-parser");
var session = require("express-session");
var RedisStore = require("connect-redis")(session);
var cache = require("./helper/cache");
var redisHelper = cache.redis

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

app.get('/', function(req, res){
    res.send('Hello World!');
})

app.use("/user",require("./routes/user"));
app.use("/proposal",require("./routes/proposal"));
app.use("/delibration",require("./routes/delibration"));


app.listen(3000, function(){
    console.log('Example app listening on port 3000!'); 
})
