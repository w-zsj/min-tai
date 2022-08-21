
const IS_TEST = process.env.NODE_ENV == 'development';
const SERVER_PRD = 'https://api.taihail.com/portal';
const SERVER_TEST = 'http://testapi.taihail.com/portal';
/*
 * SK:storage key
 * 本地存储键名
 */
const SK = {
    TOKEN: IS_TEST ? 'test_token' : 'token',
    NICK_NAME: IS_TEST ? 'test_nickname' : 'nickname',
    USER_IMAGE: IS_TEST ? 'test_userImage' : 'userImage',
    USER_UID: IS_TEST ? 'test_uid' : 'uid',
    USER_STYLE: IS_TEST ? 'test_userStyle' : 'userStyle',
    LOGS: IS_TEST ? 'test_logs' : 'logs',
    USER_INFO: IS_TEST ? 'test_userInfo' : 'userInfo',
    REGECT_LOGIN_PHONEE: IS_TEST ? 'test_regectLoginPhone' : 'regectLoginPhone',
    USER_PHONE: IS_TEST ? 'test_phone' : 'phone', // 手机号是否存在
    HAS_MOBILE: IS_TEST ? 'test_hasmobile' : 'hasmobile', // 手机号是否存在
    SEARCH_HISTORY: IS_TEST ? 'test_history' : 'history', // 搜索历史
    COIN: IS_TEST ? 'test_coin' : 'coin', //嗨币
};
const reqConfig = {
    IS_TEST,
    version: '2.1.8',
    os: 'wx',
    key: "TWpBeU1YZGxhWGhwYmtBd01EZDNlQT09",
    payType: 'xcx'
}
module.exports = {
    IS_TEST,
    SERVER: IS_TEST ? SERVER_TEST : SERVER_PRD,
    SK,
    reqConfig
};
