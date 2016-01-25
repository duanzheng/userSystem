var express = require('express');
var router = express.Router();
var customDao = require('../dao/customDao');;
var utils = require('utility');

/* GET users listing. */
router.get('/', function (req, res, next) {
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
    if (req.query.language) {
        req.session.locale = req.query.language;
        res.redirect('/kefu');
    }
    var data = {
        appId: req.session.appId
    };
    customDao.getNotice(data, function (result) {
        res.render('kefu', {
            title: res.__('kefu'),
            issueSubmit: res.__('issueSubmit'),
            historyIssue: res.__('historyIssue'),
            notice: JSON.parse(result)[0]
        });
    });
});

router.get('/issueSubmit', function (req, res, next) {
    var data = {
        appId: req.session.appId
    };
    console.log(data);
    customDao.getTypeList(data, function (result) {
        res.render('issueSubmit', {
            title: res.__('issueSubmit'),
            submitQus: res.__('submitQus'),
            srhPlaceholder: res.__("srhPlaceholder"),
            typeList: JSON.parse(result)
        });
    });
});

router.get('/issueSearch', function (req, res, next) {
    var data = {
        typeId: req.query.typeId,
    }
    customDao.getFaqList(data, function (result) {
        res.render('issueSearch', {
            title: res.__('issueSearch'),
            submitQus: res.__('submitQus'),
            srhPlaceholder: res.__("srhPlaceholder"),
            cannotFind: res.__('cannotFind'),
            faqList: JSON.parse(result)
        });
    });
});

router.get('/issueDetail', function (req, res, next) {
    var data = {
        id: req.query.id
    }
    customDao.getFaqDetail(data, function (result) {
        res.render('issueDetail', {
            title: res.__('issueDetail'),
            faqDetail: JSON.parse(result)
        });
    });
});

router.post('/searchFAQ', function (req, res, next) {
    var data = {
        appId: req.session.appId,
        key: req.body.key
    }
    console.log(data);
    customDao.searchFAQ(data, function (result) {
        res.json(JSON.parse(result));
        console.log(JSON.parse(result));
    });
});

router.get('/contactUs', function (req, res, next) {
    var data = {
        appId: req.session.appId
    }
    console.log(data);
    customDao.getTypeParams(data, function (result) {
        var result = JSON.parse(result);
        var typeIdList = [];
        var newTypeList = [];
        if (result) {
            result.forEach(function (type) {
                if (typeIdList.indexOf(type.type) == -1) {
                    typeIdList.push(type.type);
                }
            });
        }
        typeIdList.forEach(function (id) {
            var obj = {};
            obj['params'] = [];
            if (result) {
                result.forEach(function (type) {
                    if (type.type == id) {
                        obj['typeid'] = id;
                        obj['typename'] = type.type_name;
                        if (type.name) {
                            obj['params'].push({
                                name: type.name,
                                paramid: type.id
                            });
                        }
                    }
                });
            }
            newTypeList.push(obj);
        });
        console.log("newTypeList: " + JSON.stringify(newTypeList));
        res.render('contactUs', {
            title: res.__('submitQus'),
            send: res.__('send'),
            deviceType: res.__('deviceType'),
            qusClass: res.__('qusClass'),
            qusDesc: res.__('qusDesc'),
            enter: res.__('enter'),
            checkInput: res.__('checkInput'),
            typeList: newTypeList
        });
    });
});

router.get('/historyIssue', function (req, res, next) {
    var data = {
        appId: req.session.appId,
        playerId: req.session.playerId,
        serverId: req.session.serverId,
        start: 0,
        rows: 10
    };
    customDao.getQusList(data, function (result) {
        res.render('historyIssue', {
            title: res.__('historyIssue'),
            qusMore: res.__('qusMore'),
            status: res.__('status'),
            status0: res.__('status0'),
            status1: res.__('status1'),
            status2: res.__('status2'),
            status3: res.__('status3'),
            qusList: JSON.parse(result)
        });
    });
});

router.post('/qusMore', function (req, res, next) {
    var data = {
        appId: req.session.appId,
        playerId: req.session.playerId,
        start: req.body.start,
        rows: req.body.rows
    };
    customDao.getQusList(data, function (result) {
        res.json(JSON.parse(result))
    });
});

router.get('/questionInfo', function (req, res, next) {
    var data = {
        questionId: req.query.questionId
    };
    customDao.getQusDetail(data, function (result) {
        res.render('questionInfo', {
            title: res.__('questionInfo'),
            qusAdd: res.__('qusAdd'),
            qusAddEnter: res.__('qusAddEnter'),
            qusDel: res.__('qusDel'),
            qusDelConfirm: res.__('qusDelConfirm'),
            qusDelOver: res.__('qusDelOver'),
            btnCancel: res.__('btnCancel'),
            btnConfirm: res.__('btnConfirm'),
            service: res.__('service'),
            serviceScore: res.__('serviceScore'),
            score1: res.__('score1'),
            score2: res.__('score2'),
            score3: res.__('score3'),
            qusDetail: JSON.parse(result)
        });
    });
});

router.post('/submitQus', function (req, res, next) {
    var submitSign = ['2.0',req.session.appId,req.session.serverId,req.session.playerId,'10','12345670'].join('_');
    var sign = utils.md5(submitSign);
    var data = {
        version: '2.0',
        badge: '10',
        playerId: req.session.playerId,
        playerName: req.session.playerName,
        phone: '',
        playerEmail: '',
        vipno:'10',
        appId: req.session.appId,
        serverId: req.session.serverId,
        originalId: req.body.originalId,
        qus: req.body.qus,
        attachment: '',
        sign: sign,
        title: '',
        device: req.body.device,
        channel: '1',
        typeId: req.body.typeId,
        params: req.body.params
    };
    customDao.submitQus(data, function (result) {
        res.json(result);
    });
});

router.post('/deleteQus', function (req, res, next) {
    var deleteSign = [req.session.appId,req.body.questionId,'12345670'].join('_');
    var sign = utils.md5(deleteSign);
    var data = {
        questionId: req.body.questionId,
        appId: req.session.appId,
        sign: sign
    };
    customDao.deleteQus(data, function (result) {
        res.json(result);
    });
});

router.post('/opScore', function (req, res, next) {
    var opScoreSign = [req.session.appId,req.body.originalId,req.body.playerId,'12345670'].join('_');
    var sign = utils.md5(opScoreSign);
    var data = {
        originalId: req.body.originalId,
        playerId: req.session.playerId,
        evaluation: req.body.evaluation,
        appId: req.session.appId,
        sign: sign
    };
    console.log("opScore data: " + JSON.stringify(data));
    customDao.opScore(data, function (result) {
        res.json(result);
    });
});

module.exports = router;
