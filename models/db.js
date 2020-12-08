let connection = require('./mysql.js')
connection = connection.connection

exports.Insert = function Insert (table, data, callback) {
  const sql = 'INSERT INTO ' + table + ' SET ? '
  console.log(sql)
  console.log('Data: {')
  for (const i in data) {
    console.log(i + ' : ' + data[i])
  }
  console.log('}')
  connection.query(sql, data, function (err, results) {
    // if (err) throw err
    // console.log('Create Success!')
    callback(err, results)
  })
}

exports.DeleteById = function DeleteById (table, id, callback) {
  const sql = 'DELETE FROM ' + table + ' WHERE id = ' + id
  console.log(sql)
  connection.query(sql, function (err, results) {
    // if (err) throw err
    // console.log('DELETE Success!')
    callback(err, results)
  })
}

exports.DeleteByColumn = function DeleteByColumn (table, conditions, callback) {
  const condition = conditionjoin(conditions)
  const sql = 'DELETE FROM ' + table + ' WHERE ' + condition
  console.log(sql)
  connection.query(sql, function (err, results) {
    if (err) throw err
    console.log('DELETE Success!')
    callback(err)
  })
}

exports.GetAll = function GetAll (table, order, callback) {
  const sql = 'SELECT * FROM ' + table + ' ORDER BY ' + order.column + ' ' + order.order
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    if (err) throw err
    callback(results)
  })
}

exports.GetColumn = function GetColumn (table, cols, order, callback) {
  let columns = ''
  for (const i in cols) {
    columns += cols[i]
    if (i !== cols.length - 1) {
      columns += ','
    }
  }
  const sql = 'SELECT ' + columns + ' FROM ' + table + ' ORDER BY ' + order.column + ' ' + order.order
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    if (err) throw err
    callback(results)
  })
}

exports.FindbyID = function FindbyID (table, id, callback) {
  const sql = 'SELECT * FROM ' + table + ' WHERE id = ' + id
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    if (err) throw err
    callback(results[0])
  })
}

exports.FindbyColumn = function FindbyColumn (table, cols, conditions, callback) {
  let columns = ''
  for (const i in cols) {
    columns += cols[i]
    if (i !== (cols.length - 1)) {
      columns += ','
      console.log('columns: ' + columns + '; i: ' + i + '; cols.length: ' + (cols.length - 1))
    }
  }
  const condition = conditionjoin(conditions)
  const sql = 'SELECT ' + columns + ' FROM ' + table + ' WHERE ' + condition
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    if (err) throw err
    callback(results)
  })
}

exports.FindbyColumnClear = function FindbyColumnClear (table, cols, conditions, callback) {
  let ctr = 0
  let columns = ''
  for (const i in cols) {
    columns += cols[i]
    if (i !== cols.length - 1) {
      columns += ','
    }
  }
  let condition = ''
  for (const idx in conditions) {
    const value = conditions[idx]
    condition += ` ${idx}=${value} `
    ctr++
    if (ctr !== Object.keys(conditions).length) { condition += 'AND' }
  };

  const sql = 'SELECT ' + columns + ' FROM ' + table + ' WHERE' + condition
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    if (err) throw err
    callback(results)
  })
}

exports.FindbyColumnOrder = function FindbyColumnOrder (table, conditions, order, callback) {
  const condition = conditionjoin(conditions)
  const sql = 'SELECT * FROM ' + table + ' WHERE ' + condition + ' ORDER BY ' + order.column + ' ' + order.order
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    if (err) throw err
    callback(results)
  })
}

exports.Update = function Update (table, datas, conditions, callback) {
  const condition = conditionjoin(conditions)
  let data = ''
  let count = 0
  const size = Object.keys(datas).length - 1
  for (const i in datas) {
    if (typeof datas[i] === 'number') {
      data = data + i + ' = ' + datas[i]
    } else {
      data = data + i + ' = \'' + datas[i] + '\''
    }
    if (count === size) {
      break
    } else {
      count++
      data = data + ','
    }
  }
  const sql = 'UPDATE ' + table + ' SET ' + data + ' WHERE ' + condition
  console.log(sql)
  console.log('Data: {')
  for (const i in datas) {
    console.log(i + ' : ' + datas[i])
  }
  console.log('}')
  connection.query(sql, function (err, results) {
    // if (err) throw err
    callback(err, results)
  })
}

exports.UpdatePlusone = function UpdatePlusone (table, col, id, callback) {
  const sql = 'UPDATE ' + table + ' SET ' + col + ' = ' + col + '+1 WHERE id = ' + id
  console.log(sql)
  connection.query(sql, function (err, results) {
    if (err) throw err
    callback(results)
  })
}

exports.Query = function Query (sql, callback) {
  console.log(sql)
  connection.query(sql, function (err, results, fields) {
    // if (err) throw err
    callback(err, results)
  })
}

function conditionjoin (conditions) {
  let condition = ''
  let count = 0
  const size = Object.keys(conditions).length - 1
  for (const i in conditions) {
    if (typeof conditions[i] === 'number') {
      condition = condition + i + ' = ' + conditions[i]
    } else {
      if (conditions[i].indexOf(',') !== -1) {
        condition = condition + i + ' in( '
        const query = conditions[i].split(',')
        for (const j in query) {
          condition += '\'' + query[j] + '\''
          if (j !== query.length - 1) condition += ','
        }
        condition += ' )'
      } else {
        condition = condition + i + ' LIKE \'%' + conditions[i] + '%\''
      }
    }
    if (count === size) {
      return condition
    } else {
      count++
      condition = condition + ' AND '
    }
  }
}
