/**
 * Created by Administrator on 2015/9/23.
 */
var express = require('express');
var router = express.Router();
var configDao = require('../dao/configDao');
var multiparty = require('multiparty');
var path = require('path');
var fs = require('fs');

router.get("/", function (req, res, next) {
    res.render('configLogin', {
    });
});

router.get("/gameConfig", function (req, res, next) {
    if (!req.session.isLogin) {
        res.redirect('/config');
        return;
    }
    configDao.getRecommendApps(function (data) {
        res.render('mainConfig', {
            apps: data
        });
    });
});

router.get("/gameAdd", function (req, res, next) {
    if (!req.session.isLogin) {
        res.redirect('/config');
        return;
    }
    res.render('gameAdd', {
    });
});

router.get("/gameModify", function (req, res, next) {
    if (!req.session.isLogin) {
        res.redirect('/config');
        return;
    }
    configDao.getRecommendAppById(req.query, function (result) {
        res.render('gameModify', {
            game: result[0]
        });
    });
});

router.post("/login", function (req, res, next) {
    var userName = req.body.username;
    var password = req.body.password;
    if (userName == "admin" && password=="1qaz2wsx") {
        req.session.isLogin = true;
        res.json({
            result: true
        });
    }
    else {
        res.json({
            result: false
        });
    }
});

router.post("/addGame", function (req, res, next) {
    configDao.addGame(req.body, function (result) {
        if (result.insertId) {
            res.json({
                result: true,
                msg: "success"
            });
        }
        else {
            res.json({
                result: false,
                msg: result.message
            });
        }
    });
});

router.post("/modifyGame", function (req, res, next) {
    configDao.modifyGame(req.body, function (result) {
        res.json({
            result: true,
            msg: "success"
        });
    });
});

router.post("/deleteGame", function (req, res, next) {
    configDao.deleteGame(req.body, function (result) {
        res.json({
            result: true,
            msg: "success"
        });
    });
});

router.post("/uploadFile", function (req, res, next) {
    var form = new multiparty.Form({uploadDir: './public/uploadImg/'});
    form.parse(req, function (err, fields, files) {
        var filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        }
        else {
            console.log('parse files: ' + filesTmp);
            var inputFile = files.inputFile[0];
            var uploadedPath = inputFile.path;
        }
        if (uploadedPath) {
            var newName = new Date().getTime();
            //将文件名更改为时间戳+扩展名
            var newPath = 'public\\uploadImg\\' + newName + /\.[^\.]+/.exec(path.basename(uploadedPath));
            fs.rename(uploadedPath, newPath, function (err) {
                if (err) throw err;
            });
            var fileName = path.basename(newPath);
            console.log("newFile: " + path.basename(newPath));
            res.send("/uploadImg/" + fileName);
        }
    });
});

module.exports = router;