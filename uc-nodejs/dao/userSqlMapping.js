/**
 * Created by Administrator on 2015/9/8.
 */
var user = {
    queryRecommendApp: 'SELECT * FROM app_info',
    queryUserInfo: 'SELECT * FROM user_info WHERE openid = ?',
    updataUserGender: 'UPDATE user_info SET sex = ? WHERE openid = ?',
    updateUserBirth: 'UPDATE user_info SET birthday = ? WHERE openid = ?',
    updateUserQq: 'UPDATE user_info SET qq = ? WHERE openid = ?',
    addUser: 'INSERT INTO user_info(openid) VALUES(?)'
};

module.exports = user;