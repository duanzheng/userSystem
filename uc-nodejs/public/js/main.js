var uc = uc || {
//	serverUrl: "http://192.168.106.68:8080/UCenter/",
	serverUrl: "../",
}

uc.initLocalStorage = function () {
    var lcstrg = function () {
        this.get = function (key) {
            var val = window.localStorage.getItem(key);
            try {
                val = eval('(' + val + ')');
            } catch (e) {
                console.log("convert failed[" + val + "]:" + e);
            }
            return val;
        };
        this.set = function (key, val) {
            if (typeof(val) == "object") {
                val = JSON.stringify(val);
            } else if (typeof(val) == "number") {
                val = "" + val;
            }
            window.localStorage.setItem(key, val);
        };
        this.remove = function (key) {
            window.localStorage.removeItem(key);
        };
    };
    return new lcstrg();
};

uc.initSessionStorage = function () {
    var ssstrg = function () {
        this.get = function (key) {
            var val = window.sessionStorage.getItem(key);
            try {
                val = eval('(' + val + ')');
            } catch (e) {
                console.log("convert failed[" + val + "]:" + e);
            }
            return val;
        };
        this.set = function (key, val) {
            if (typeof(val) == "object") {
                val = JSON.stringify(val);
            } else if (typeof(val) == "number") {
                val = "" + val;
            }
            window.sessionStorage.setItem(key, val);
        };
        this.remove = function (key) {
            window.sessionStorage.removeItem(key);
        };
    }
    return new ssstrg();
};
uc.localStorage = uc.initLocalStorage();
uc.sessionStorage = uc.initSessionStorage();

uc.initReq = function() {
	var req = function() {
		this.get = function(urlConstant, data, callback) {
			var url = uc.serverUrl + urlConstant;
			var gameData = uc.sessionStorage.get(KEY_GAME_DATA);
			var userInfo = {
				openid: gameData.openid,
				appid: gameData.appid,
				token: gameData.token,
				serverid: gameData.serverid,
				playerid: gameData.playerid,
				playername: gameData.playername
			}
			data = $.extend(true, data, userInfo);
			$.get(url, data, function(data) {
				data = JSON.parse(data);
				if (data.code == 1) {
					callback(true, data);
				}
				else {
					callback(false, data.message);
				}
			});
		}
		this.post = function(urlConstant, data, callback) {
			var url = uc.serverUrl + urlConstant;
			var gameData = uc.sessionStorage.get(KEY_GAME_DATA);
//			var userInfo = {
//				openid: 1,
//				appid: 1,
//				token: 1,
//				gameid: 1,
//				areaid: 1,
//				serverid: 20,
//				playerid: 1,
//				playername: 1
//			}
			var userInfo = {
				openid: gameData.openid,
				appid: gameData.appid,
				token: gameData.token,
				serverid: gameData.serverid,
				playerid: gameData.playerid,
				playername: gameData.playername
			}
			data = $.extend(true, data, userInfo);
			$.post(url, data, function(data) {
				data = JSON.parse(data);
				if (data.code == 1) {
					callback(true, data);
				}
				else {
					callback(false, data.message);
				}
			});
		}
	}
	return new req();
}
uc.req = uc.initReq();

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 // 月份
        "d+": this.getDate(),                    // 日
        "h+": this.getHours(),                   // 小时
        "m+": this.getMinutes(),                 // 分
        "s+": this.getSeconds(),                 // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()             // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

uc.initCommon = function() {
	var common = function() {
		this.linkTo = function(pageUrl) {
			window.location.href = pageUrl;
		}
		this.formData = function(date) {
			var year = date.getFullYear(); 
			var month = date.getMonth() + 1; 
			var day = date.getDate(); 
			var hour = date.getHours(); 
			var minute = date.getMinutes(); 
			var second = date.getSeconds(); 
			return year + "-" + _formatTen(month) + "-" + _formatTen(day); 
		}
		function _formatTen (num) {
			return num > 9 ? (num + "") : ("0" + num);
		}
		this.showWaiting = function() {
			$(".uc-waiting").show();
		}
		this.hideWaiting = function() {
			$(".uc-waiting").hide();
		}
	}
	return new common();
}
uc.common = uc.initCommon();

$(document).ready(function() {
	var domHtml = '<div class="uc-waiting"><div class="uc-waiting-panel">';
	domHtml += '<i class="fa fa-spinner fa-spin uc-waiting-icon"></i>';
	domHtml += '<div class="uc-waiting-text">正在加载…</div></div></div>';
	domHtml += '<div class="uc-prompt uc-prompt-failed"></div>';
	$("body").append(domHtml);
});

function showPrompt (text) {
	$(".uc-prompt-failed").text(text);
	$(".uc-prompt-failed").show();
	setTimeout(function() {
		$(".uc-prompt-failed").hide();
	}, 2000);
}