/**
 * Created by Administrator on 2015/9/8.
 */
/**
 * Created by Administrator on 2015/8/25.
 */
var http = require('http');
var mysql = require('mysql');
var request = require('request');
var qs = require('querystring');
var url = require('./customUrlMapping');
var conf = require('../conf/db');

module.exports = {
    getNotice: function (data, callback) {
        sendRequest(url.getNotice, data, callback);
    },
    getTypeList: function (data, callback) {
        sendRequest(url.getTypeList, data, callback);
    },
    getFaqList: function (data, callback) {
        sendRequest(url.getFaqList, data, callback);
    },
    getFaqDetail: function (data, callback) {
        sendRequest(url.getFaqDetail, data, callback);
    },
    searchFAQ: function (data, callback) {
        sendGetRequest(url.searchFAQ, data, callback);
    },
    getTypeParams: function (data, callback) {
        sendRequest(url.getTypeParams, data, callback);
    },
    getQusList: function (data, callback) {
        sendRequest(url.getQusList, data, callback);
    },
    getQusDetail: function (data, callback) {
        sendRequest(url.getQusDetail, data, callback);
    },
    submitQus: function (data, callback) {
        sendRequest(url.submitQus, data, callback);
    },
    deleteQus: function (data, callback) {
        sendRequest(url.deleteQus, data, callback);
    },
    opScore: function (data, callback) {
        sendRequest(url.opScore, data, callback);
    }
};

function sendRequest (url, data, callback) {
    console.log("send url: " + conf.customSystem + url + " data: " + JSON.stringify(data));
    request.post({
        url: conf.customSystem + url,
        form: data
    }, function(error, response, body) {
        if (!error && response.statusCode == 200) {
        	console.log("response: " + JSON.stringify(response));
            console.log("result body: " + body);
            callback(body);
        }else{
            console.log("error: " + JSON.stringify(response));
            console.log("result body: : " + body);
        }
    });
}

function sendGetRequest (url, data, callback) {
    console.log("send url: " + conf.customSystemGetUrl + url + " data: " + qs.stringify(data));
    var options = {
        hostname: conf.customSystemGetUrl,
        //port: 8090,
        path: '/CustomSystem' + url + '?' + qs.stringify(data),
        method: 'GET'
    };

    var req = http.request(options, function (res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
            callback(chunk);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
}