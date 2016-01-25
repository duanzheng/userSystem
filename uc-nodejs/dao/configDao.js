/**
 * Created by Administrator on 2015/9/23.
 */
var mysql = require('mysql');
var request = require('request');
var conf = require('../conf/db');
var util = require('../util/util');
var sql = require('./configSqlMapping');

var pool  = mysql.createPool(util.extend({}, conf.mysql));

module.exports = {
    getRecommendApps: function (callback) {
        connectDatabase(sql.queryApps, "", function(result) {
            callback(result);
        });
    },
    getRecommendAppById: function (data, callback) {
        connectDatabase(sql.queryAppById, [data.id], function(result) {
            callback(result);
        });
    },
    addGame: function (data, callback) {
        connectDatabase(sql.addApp, [data.name, data.icon, data.url], function(result) {
            callback(result);
        });
    },
    modifyGame: function (data, callback) {
        connectDatabase(sql.modifyApp, [data.name, data.icon, data.url, data.id], function(result) {
            callback(result);
        });
    },
    deleteGame: function (data, callback) {
        connectDatabase(sql.deleteApp, [data.id], function(result) {
            callback(result);
        });
    },
}

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