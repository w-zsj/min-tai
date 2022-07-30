
const IS_TEST = process.env.NODE_ENV == 'development';
const SERVER_PRD = 'https://api.9jinhuan.com';
const SERVER_TEST = 'http://testapi.taihail.com/porta/';
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
    HAS_MOBILE: IS_TEST ? 'test_hasmobile' : 'hasmobile', // 手机号是否存在
    USER_VIP_INFO: IS_TEST ? 'test_uservipinfo' : 'uservipinfo',
    COUPON_INTEGRAL_ORDER_SN: IS_TEST ? 'test_couponIntegralOrderSn' : 'couponIntegralOrderSn',
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
