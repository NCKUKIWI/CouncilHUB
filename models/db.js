var connection = require('./mysql.js');
connection = connection.connection;

exports.Insert = function Insert(table, data, callback) {
    var sql = "INSERT INTO " + table + " SET ? ";
    console.log(sql);
    console.log("Data: {");
    for (var i in data) {
        console.log(i + " : " + data[i]);
    }
    console.log("}");
    connection.query(sql, data, function (err, results) {
        if (err) throw err;
        console.log("Create Success!");
        callback(err, results);
    });
}

exports.DeleteById = function DeleteById(table, id, callback) {
    var sql = "DELETE FROM " + table + " WHERE id = " + id;
    console.log(sql);
    connection.query(sql, function (err, results) {
        if (err) throw err;
        console.log("DELETE Success!");
        callback(err);
    });
}

exports.DeleteByColumn = function DeleteByColumn(table, conditions, callback) {
    var condition = conditionjoin(conditions);
    var sql = "DELETE FROM " + table + " WHERE " + condition;
    console.log(sql);
    connection.query(sql, function (err, results) {
        if (err) throw err;
        console.log("DELETE Success!");
        callback(err);
    });
}

exports.GetAll = function GetAll(table, order, callback) {
    var sql = "SELECT * FROM " + table + " ORDER BY " + order['column'] + " " + order['order'];
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

exports.GetColumn = function GetColumn(table, cols, order, callback) {
    var columns = "";
    for (var i in cols) {
        columns += cols[i];
        if (i != cols.length - 1) {
            columns += ",";
        }
    }
    var sql = "SELECT " + columns + " FROM " + table + " ORDER BY " + order['column'] + " " + order['order'];
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

exports.FindbyID = function FindbyID(table, id, callback) {
    var sql = "SELECT * FROM " + table + " WHERE id = " + id;
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results[0]);
    });
}

exports.FindbyColumn = function FindbyColumn(table, cols, conditions, callback) {
    var columns = "";
    for (var i in cols) {
        columns += cols[i];
        if (i != cols.length - 1) {
            columns += ",";
        }
    }
    var condition = conditionjoin(conditions);
    var sql = "SELECT " + columns + " FROM " + table + " WHERE " + condition;
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

exports.FindbyColumnClear = function FindbyColumnClear(table, cols, conditions, callback) {
    var ctr = 0
    var columns = "";
    for (var i in cols) {
        columns += cols[i];
        if (i != cols.length - 1) {
            columns += ",";
        }
    }
    var condition = "";
    for (let idx in conditions) {
        let value = conditions[idx]
        condition += ` ${idx}=${value} `
        ctr++
        if (ctr != Object.keys(conditions).length)
            condition += "AND"
    };

    var sql = "SELECT " + columns + " FROM " + table + " WHERE" + condition;
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

exports.FindbyColumnOrder = function FindbyColumnOrder(table, conditions, order, callback) {
    var condition = conditionjoin(conditions);
    var sql = "SELECT * FROM " + table + " WHERE " + condition + " ORDER BY " + order['column'] + " " + order['order'];
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

exports.Update = function Update(table, datas, conditions, callback) {
    var condition = conditionjoin(conditions);
    var data = "";
    count = 0;
    size = Object.keys(datas).length - 1;
    for (var i in datas) {
        if (typeof datas[i] === "number") {
            data = data + i + " = " + datas[i];
        } else {
            data = data + i + " = \'" + datas[i] + "\'";
        }
        if (count == size) {
            break;
        } else {
            count++;
            data = data + ",";
        }
    }
    var sql = "UPDATE " + table + " SET " + data + " WHERE " + condition;
    console.log(sql);
    console.log("Data: {");
    for (var i in datas) {
        console.log(i + " : " + datas[i]);
    }
    console.log("}");
    connection.query(sql, function (err, results) {
        if (err) throw err;
        callback(results);
    });
}

exports.UpdatePlusone = function UpdatePlusone(table, col, id, callback) {
    var sql = "UPDATE " + table + " SET " + col + " = " + col + "+1 WHERE id = " + id;
    console.log(sql);
    connection.query(sql, function (err, results) {
        if (err) throw err;
        callback(results);
    });
}

exports.Query = function Query(sql, callback) {
    console.log(sql);
    connection.query(sql, function (err, results, fields) {
        if (err) throw err;
        callback(results);
    });
}

function conditionjoin(conditions) {
    var condition = "";
    var count = 0;
    var size = Object.keys(conditions).length - 1;
    for (var i in conditions) {
        if (typeof conditions[i] === "number") {
            condition = condition + i + " = " + conditions[i];
        } else {
            if (conditions[i].indexOf(",") != -1) {
                condition = condition + i + " in( ";
                var query = conditions[i].split(",");
                for (var j in query) {
                    condition += "\'" + query[j] + "\'";
                    if (j != query.length - 1) condition += ',';
                }
                condition += " )";
            } else {
                condition = condition + i + " LIKE \'%" + conditions[i] + "%\'";
            }
        }
        if (count == size) {
            return condition;
        } else {
            count++;
            condition = condition + " AND ";
        }
    }
}