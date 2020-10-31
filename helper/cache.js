var redis = require("redis");
var config = require("../config");

client = redis.createClient({
    "host": "localhost",
    "port": 6379,
    "password": "plmil456",
    "db": 1
});

function delibrationCacheKey(studentID){
    return "delibration_" + studentID;
}

module.exports = {
    redis: client,
    delibrationCacheKey: delibrationCacheKey
}
