var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.query.language) {
        req.session.locale = req.query.language;
        res.redirect('back');
    }

    res.render('index', {
        title: 'PPGAME - 首页',
        myInfo: res.__('myInfo'),
        bindAccount: res.__('bindAccount'),
        setAccount: res.__('setAccount'),
        myFav: res.__('myFav')
    });
});

module.exports = router;
