/**
 * Created by Administrator on 2015/9/8.
 */
/**
 * Created by Administrator on 2015/9/8.
 */
/**
 * Created by Administrator on 2015/8/25.
 */
var mysql = require('mysql');
var request = require('request');
var conf = require('../conf/db');
var util = require('../util/util');
var sql = require('./userSqlMapping');
var url = require('./userUrlMapping');

var pool  = mysql.createPool(util.extend({}, conf.mysql));

module.exports = {
    queryRecommendApp: function (callback) {
        connectDatabase(sql.queryRecommendApp, "", function(result) {
            callback(result);
        });
    },
    getUserInfo: function (data, callback) {
        sendRequest(url.getUserInfo, data, function(result) {
            callback(result);
        });
    },
    getUserExtraInfo: function (data, callback) {
        connectDatabase(sql.queryUserInfo, [data.openId], function(result) {
            callback(result[0]);
        });
    },
    setUserGender: function (data, callback) {
        connectDatabase(sql.updataUserGender, [data.gender, data.openId], function(result) {
            callback(result);
        });
    },
    setUserBirth: function (data, callback) {
        connectDatabase(sql.updateUserBirth, [data.birth, data.openId], function(result) {
            callback(result);
        });
    },
    setUserQq: function (data, callback) {
        connectDatabase(sql.updateUserQq, [data.qq, data.openId], function(result) {
            callback(result);
        });
    },
    addUser: function (data, callback) {
        connectDatabase(sql.addUser, [data.openId], function(result) {
            callback(result);
        });
    },
    getVcode: function (data, callback) {
        sendRequest(url.getVcode, data, function(result) {
            callback(result);
        });
    },
    bindPhone: function (data, callback) {
        sendRequest(url.bindPhone, data, function(result) {
            callback(result);
        });
    },
    bindEmail: function (data, callback) {
        sendRequest(url.bindEmail, data, function(result) {
            callback(result);
        });
    },
    changePwdByEmail: function (data, callback) {
        sendRequest(url.changePwdByEmail, data, function(result) {
            callback(result);
        });
    },
    changePwdByPhone: function (data, callback) {
        sendRequest(url.changePwdByPhone, data, function(result) {
            callback(result);
        });
    }
};

function connectDatabase (sql, params, callback) {
    console.log("database sql: " + sql);
    console.log("database params: " + JSON.stringify(params));
    pool.getConnection(function(err, connection) {
        connection.query(sql, params, function(err, result) {
            if (result) {
                console.log("database result: " + JSON.stringify(result));
                callback(result);
            }
            else {
                console.log("database error: " + JSON.stringify(err));
                callback(false);
            }
            connection.release();
        });
    });
}

function sendRequest (url, data, callback) {
    console.log("send url: " + conf.userSystem + url + " data: " + JSON.stringify(data));
    request.post({
        url: conf.userSystem + url,
        form: "val=" + JSON.stringify(data)
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("result body: " + body);
            if (typeof(body) == "object") {
                callback(body);
            }
            else {
                callback(JSON.parse(body));
            }
        }
        else {
            console.log("error: " + error);
        }
    });
}