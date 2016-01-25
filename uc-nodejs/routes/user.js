var express = require('express');
var router = express.Router();
var userDao = require('../dao/userDao');
var util = require('../util/util');

/* GET users listing. */
router.get('/', function (req, res, next) {
    if (req.query.openid) {
        req.session.openId = req.query.openid;
    }
    if (req.query.token) {
        req.session.token = req.query.token;
    }
    if (req.query.appid) {
        req.session.appId = req.query.appid;
    }
    if (req.query.serverid) {
        req.session.serverId = req.query.serverid;
    }
    if (req.query.playerid) {
        req.session.playerId = req.query.playerid;
    }
    if (req.query.playername) {
        req.session.playerName = req.query.playername;
    }
    if (req.query.account) {
        req.session.account = req.query.account;
    }

    if (req.query.hasPhone) {
        req.session.hasPhone = req.query.hasPhone;
    }
    else if (req.session.hasPhone == "" || req.session.hasPhone == undefined) {
        req.session.hasPhone = "true";
    }

    if (req.query.language) {
        req.session.locale = req.query.language;
        res.redirect('/user');
    }
    else if (!req.session.locale) {
        req.session.locale = "cn";
        res.redirect('/user');
    }
    var data = {
        openid: req.session.openId,
        access_token: req.session.token,
        app_id: req.session.appId
    };
    userDao.queryRecommendApp(function(recommendApp) {
        userDao.getUserInfo(data, function (userInfo) {
            res.render('user', {
                hasPhone: req.session.hasPhone,
                account: req.session.account,
                apps: recommendApp,
                userInfo: userInfo,
                myInfo: res.__('myInfo'),
                bindAccount: res.__('bindAccount'),
                setAccount: res.__('setAccount'),
                myFav: res.__('myFav')
            });
        });
    });
});

router.get('/myInfo', function (req, res, next) {
    userDao.getUserInfo({openid: req.session.openId, access_token: req.session.token, app_id: req.session.appId}, function (basicUserInfo) {
        userDao.getUserExtraInfo({openId: req.session.openId}, function(userInfo) {
            if (!userInfo) {
                userDao.addUser({openId: req.session.openId}, function (result) {});
            }
            res.render('myInfo', {
                title: res.__('myInfo'),
                basicUserInfo: basicUserInfo,
                userInfo: userInfo,
                account: req.session.account,
                userName: res.__('userName'),
                phone: res.__('phone'),
                email: res.__('email'),
                sex: res.__('sex'),
                male: res.__('male'),
                female: res.__('female'),
                clear: res.__('clear'),
                birth: res.__('birth'),
                qq: res.__('qq'),
                qqEdit: res.__('qqEdit'),
                descEdit: res.__('qqDesc'),
                btnCancel: res.__('btnCancel'),
                btnConfirm: res.__('btnConfirm')
            });
        });
    });
});

router.get('/myMsg', function (req, res, next) {
    res.render('myMsg', {
        title: res.__('myMsg')
    });
});

router.get('/bindAccount', function (req, res, next) {
    res.render('bindAccount', {
        title: res.__('bindAccount'),
        bindAccount: res.__('bindAccount'),
        phoneNum: res.__('phoneNum'),
        vCode: res.__('vCode'),
        getVcode: res.__('getVcode'),
        bindEmail: res.__('bindEmail'),
        setPwd: res.__('setPwd'),
        bindSuccess: res.__('bindSuccess'),
        orChoose: res.__("orChoose"),
        checkPhoneNum: res.__("checkPhoneNum"),
        checkVeriCode: res.__("checkVeriCode"),
        checkVeriCodeAll: res.__("checkVeriCodeAll"),
        reGetVcodeBefore: res.__("reGetVcodeBefore"),
        reGetVcode: res.__("reGetVcode"),
        checkPwd: res.__("checkPwd"),
        checkPwdAll: res.__("checkPwdAll")
    });
});

router.get('/accountSet', function (req, res, next) {
    var data = {
        openid: req.session.openId,
        access_token: req.session.token,
        app_id: req.session.appId
    };
    console.log("hasPhone: " + req.session.hasPhone);
    userDao.getUserInfo(data, function (userInfo) {
        res.render('accountSet', {
            hasPhone: req.session.hasPhone,
            title: res.__('setAccount'),
            setPwdByPhone: res.__('setPwdByPhone'),
            setPwdByEmail: res.__('setPwdByEmail'),
            bindPhone: res.__('bindPhone'),
            bindEmail: res.__('bindEmail'),
            userInfo: userInfo
        });
    });
});

router.get('/bindPhone', function (req, res, next) {
    res.render('bindPhone', {
        title: res.__('bindPhone'),
        phoneNum: res.__('phoneNum'),
        vCode: res.__('vCode'),
        getVcode: res.__('getVcode'),
        bindAccount: res.__('bindAccount'),
        bindSuccess: res.__('bindSuccess'),
        checkPhoneNum: res.__("checkPhoneNum"),
        checkVeriCode: res.__("checkVeriCode"),
        checkVeriCodeAll: res.__("checkVeriCodeAll"),
        reGetVcodeBefore: res.__("reGetVcodeBefore"),
        reGetVcode: res.__("reGetVcode")
    });
});

router.get('/bindEmail', function (req, res, next) {
    res.render('bindEmail', {
        title: res.__('bindEmail'),
        email: res.__('email'),
        bindEmail: res.__('bindEmail'),
        setPwd: res.__('setPwd'),
        checkInput: res.__('checkInput'),
        checkEmail: res.__('checkEmail'),
        checkPwd: res.__("checkPwd"),
        checkPwdAll: res.__("checkPwdAll")
    });
});

router.get('/bindEmailAgain', function (req, res, next) {
    res.render('bindEmailAgain', {
        title: res.__('bindEmailAgain'),
        email: res.__('email'),
        bindEmail: res.__('bindEmail'),
        checkEmail: res.__('checkEmail')
    });
});

router.get('/bindEmailPrompt', function (req, res, next) {
    res.render('bindEmailPrompt', {
        operSuccess: res.__('operSuccess'),
        operMsg1: res.__('operMsg1'),
        operMsg2: res.__('operMsg2'),
        operReturnBefore: res.__('operReturnBefore'),
        operReturn: res.__("operReturn"),
        returnNow: res.__("returnNow")
    });
});

router.get('/setHead', function (req, res, next) {
    res.render('setHead', {
        uploadAvatar: res.__('uploadAvatar'),
        back: res.__('back')
    });
});

router.get('/setPwdByPhone', function (req, res, next) {
    var data = {
        openid: req.session.openId,
        access_token: req.session.token,
        app_id: req.session.appId
    };
    userDao.getUserInfo(data, function (userInfo) {
        res.render('setPwdByPhone', {
            title: res.__('setPwdByPhone'),
            phoneNum: res.__('phoneNum'),
            vCode: res.__('vCode'),
            getVcode: res.__('getVcode'),
            setPwd: res.__('setPwd'),
            changePwd: res.__('changePwd'),
            changeSuccess: res.__('changeSuccess'),
            checkPwd: res.__("checkPwd"),
            checkPwdAll: res.__("checkPwdAll"),
            checkVeriCode: res.__("checkVeriCode"),
            checkVeriCodeAll: res.__("checkVeriCodeAll"),
            reGetVcodeBefore: res.__("reGetVcodeBefore"),
            reGetVcode: res.__("reGetVcode"),
            userInfo: userInfo
        });
    });
});

router.get('/setPwdByEmail', function (req, res, next) {
    var data = {
        openid: req.session.openId,
        access_token: req.session.token,
        app_id: req.session.appId
    };
    userDao.getUserInfo(data, function (userInfo) {
        res.render('setPwdByEmail', {
            title: res.__('setPwdByEmail'),
            currentEmail: res.__('currentEmail'),
            setPwd: res.__('setPwd'),
            changePwd: res.__('changePwd'),
            checkPwd: res.__("checkPwd"),
            checkPwdAll: res.__("checkPwdAll"),
            userInfo: userInfo
        });
    });
});

router.post('/setUserGender', function (req, res, next) {
    userDao.setUserGender({gender: req.body.gender, openId: req.session.openId}, function (result) {
        res.json({
            result: true,
            msg: result
        });
    });
});

router.post('/setUserBirth', function (req, res, next) {
    userDao.setUserBirth({birth: req.body.birth, openId: req.session.openId}, function (result) {
        res.json({
            result: true,
            msg: result
        });
    });
});

router.post('/setUserQQ', function (req, res, next) {
    userDao.setUserQq({qq: req.body.qq, openId: req.session.openId}, function (result) {
        res.json({
            result: true,
            msg: result
        });
    });
});

router.post('/getVcode', function (req, res, next) {
    userDao.getVcode({telphone: req.body.telphone}, function (result) {
        res.json({
            result: true,
            msg: result
        });
    });
});

router.post('/bindPhone', function (req, res, next) {
    var pwd = "";
    if (req.body.pwd) {
        pwd = util.md5(req.body.pwd);
    }
    userDao.bindPhone({openid: req.session.openId, access_token: req.session.token, app_id: req.session.appId
        , telphone: req.body.telphone, vcode: req.body.vcode, login_pwd: pwd}, function (result) {
        switch (result.result){
            case 0:
                result.msg = res.__("bindSuccess");
                break;
            case 60801:
                result.msg = res.__("60801");
                break;
            case 60802:
                result.msg = res.__("60802");
                break;
            case 60803:
                result.msg = res.__("60803");
                break;
            case 60804:
                result.msg = res.__("60804");
                break;
            case 60805:
                result.msg = res.__("60805");
                break;
            case 60806:
                result.msg = res.__("60806");
                break;
            case 60807:
                result.msg = res.__("60807");
                break;
            case 60808:
                result.msg = res.__("60808");
                break;
            case 60809:
                result.msg = res.__("60809");
                break;
            case 60810:
                result.msg = res.__("60810");
                break;
            case 60811:
                result.msg = res.__("60811");
                break;
            case 60812:
                result.msg = res.__("60812");
                break;
            case 60813:
                result.msg = res.__("60813");
                break;
            case 60814:
                result.msg = res.__("60814");
                break;
            case 60815:
                result.msg = res.__("60815");
                break;
            default :
                result.msg = res.__("bindFailed");
        }
        res.json({
            result: result.result,
            msg: result.msg
        });
    });
});

router.post('/bindEmail', function (req, res, next) {
    var pwd = util.md5(req.body.pwd);
    userDao.bindEmail({openid: req.session.openId, access_token: req.session.token, app_id: req.session.appId
        , email: req.body.email, login_pwd: pwd}, function (result) {
        switch (result.result){
            case 0:
                result.msg = res.__("bindSuccess");
                break;
            case 60701:
                result.msg = res.__("60701");
                break;
            case 60702:
                result.msg = res.__("60702");
                break;
            case 60703:
                result.msg = res.__("60703");
                break;
            case 60704:
                result.msg = res.__("60704");
                break;
            case 60705:
                result.msg = res.__("60705");
                break;
            case 60706:
                result.msg = res.__("60706");
                break;
            case 60707:
                result.msg = res.__("60707");
                break;
            case 60708:
                result.msg = res.__("60708");
                break;
            case 60709:
                result.msg = res.__("60709");
                break;
            case 60711:
                result.msg = res.__("60711");
                break;
            default :
                result.msg = res.__("bindFailed");
        }
        res.json({
            result: result.result,
            msg: result.msg
        });
    });
});

router.post('/changePwdByPhone', function (req, res, next) {
    var pwd = util.md5(req.body.pwd);
    userDao.changePwdByPhone({telphone: req.body.telphone, vcode: req.body.vcode, pwd: pwd}, function (result) {
        switch (result.result){
            case 0:
                result.msg = res.__("rePwdSuccess");
                break;
            case 61701:
                result.msg = res.__("61701");
                break;
            case 61702:
                result.msg = res.__("61702");
                break;
            case 61703:
                result.msg = res.__("61703");
                break;
            case 61704:
                result.msg = res.__("61704");
                break;
            case 61705:
                result.msg = res.__("61705");
                break;
            case 61706:
                result.msg = res.__("61706");
                break;
            case 61707:
                result.msg = res.__("61707");
                break;
            default :
                result.msg = res.__("rePwdFailed");
        }
        res.json({
            result: result.result,
            msg: result.msg
        });
    });
});

router.post('/changePwdByEmail', function (req, res, next) {
    var pwd = util.md5(req.body.pwd);
    userDao.changePwdByEmail({email: req.body.email, pwd: pwd}, function (result) {
        switch (result.result){
            case 0:
                result.msg = res.__("rePwdSuccess");
                break;
            case 61801:
                result.msg = res.__("61801");
                break;
            case 61802:
                result.msg = res.__("61802");
                break;
            case 61803:
                result.msg = res.__("61803");
                break;
            case 61804:
                result.msg = res.__("61804");
                break;
            default :
                result.msg = res.__("rePwdFailed");
        }
        res.json({
            result: result.result,
            msg: result.msg
        });
    });
});

module.exports = router;
