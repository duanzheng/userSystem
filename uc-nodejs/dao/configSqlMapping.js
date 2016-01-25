/**
 * Created by Administrator on 2015/9/23.
 */
var config = {
    queryApps: 'SELECT * FROM app_info',
    queryAppById: 'SELECT * FROM app_info WHERE appid = ?',
    addApp: 'INSERT INTO app_info(name, icon, url) VALUES(?,?,?)',
    modifyApp: 'UPDATE app_info SET name=?, icon=?, url=? where appid=?',
    deleteApp: 'DELETE FROM app_info WHERE appid=?'
};

module.exports = config;