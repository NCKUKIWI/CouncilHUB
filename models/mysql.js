const mysql = require('mysql')
let connection

function handleDisconnect () {
  connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
  })

  connection.connect(function (err) {
    if (err) {
      console.log('error when connecting to db: ', err)
      setTimeout(handleDisconnect, 2000)
    }
  })

  connection.on('error', function (err) {
    console.log('db error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect()
    } else {
      throw err
    }
  })
}

handleDisconnect()

exports.connection = connection
