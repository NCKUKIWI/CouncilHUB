const redis = require('redis')

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
  password: process.env.REDIS_PW,
  db: 1
})

function delibrationCacheKey (studentID) {
  return 'delibration_' + studentID
}

module.exports = {
  redis: client,
  delibrationCacheKey: delibrationCacheKey
}
