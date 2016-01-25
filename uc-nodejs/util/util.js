/**
 * Created by Administrator on 2015/8/25.
 */
var crypto = require('crypto');

module.exports = {
    extend: function(target, source, flag) {
        for(var key in source) {
            if(source.hasOwnProperty(key))
                flag ?
                    (target[key] = source[key]) :
                    (target[key] === void 0 && (target[key] = source[key]));
        }
        return target;
    },
    md5: function(oriText) {
        return crypto.createHash('md5').update(oriText).digest('hex');
    }
}