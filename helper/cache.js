const redis = require('redis')
const config = require('../config')

const client = redis.createClient({
  host: config.redis.host,
  port: 6379,
  password: config.redis.pw,
  db: 1
})

function delibrationCacheKey (studentID) {
  return 'delibration_' + studentID
}

module.exports = {
  redis: client,
  delibrationCacheKey: delibrationCacheKey
}
