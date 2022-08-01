
/* 时间处理工具 begin */

function _getDate(datetime) {
    if (typeof datetime == 'string') {
        let arr = datetime.split(/[- : \/ T]/);

        if (arr[0].length === 4) {
            arr[1] = arr[1] - 1;
        }

        datetime = new Date(...arr);
    }

    return datetime;
}
/**
* 处理倒计时 时间误差
* @param callback 回调函数
* @param interval 执行时间
* @param firstCall 是否首次调用
*/
let initTimer = null
function timerDiff(callback = () => { }, interval = 1000, firstCall = true) {
    let count = 0;
    let start = Date.now();
    let timer;

    const loop = () => {
        let diff = Date.now() - (start + count * interval);
        let next = interval - diff;
        clearTimeout(timer);
        if (next < 0) {
            next = 0;
        }
        count++;

        timer = setTimeout(loop, next);
        callback(timer, count);
    }; // 非首次执行时 需将count++ 因为在实际第一次执行时已经有一个时间间隔的延迟

    if (firstCall) {
        loop();
    } else {
        initTimer = setTimeout(loop, interval, count++);
    }
}
/**
* 时间差(用于倒计时)
* @param {String?} type 结果类型,默认为'H',可选值:'d'天,'h'时,'m'分,'s'秒
* @param {String?|Date?} source 源时间,默认为当前时间,source与destination 必须至少有一个有值
* @param {String?|Date?} destination 目标时间,1.默认为当前时间,source与destination 必须至少有一个有值 2. 或者是毫秒数
* @returns 返回值null|{s:秒,m:分,H:时,d:天}(若为负值则表示时间指向反了)
*/

const DateDiff = ({ type = 'h', source = new Date(), destination = new Date() } = {}) => {
    let date = source;
    let ts = 0;
    try {
        if (typeof Number(destination) === 'number' && !isNaN(Number(destination))) {
            ts = destination;
        } else {
            date = _getDate(date);
            destination = _getDate(destination);
            ts = destination.getTime() - date.getTime();
        }

        let o = {
            s: Math.floor(ts / 1000),
            m: Math.floor(ts / 60000),
            //1000*60
            h: Math.floor(ts / 3600000),
            //1000*60*60
            d: Math.floor(ts / 86400000) //1000*60*60*24
        };

        if (o.s <= 0 && o.m <= 0 && o.h <= 0) {
            return 'end';
        }

        switch (type) {
            case 'h':
            default:
                return {
                    s: o.s % 60,
                    m: o.m % 60,
                    h: o.h
                };

            case 's':
                return {
                    s: o.s,
                    m: 0,
                    h: 0,
                    d: 0
                };

            case 'm':
                return {
                    s: o.s % 60,
                    m: o.m,
                    h: 0,
                    d: 0
                };

            case 'd':
                return {
                    s: o.s % 60,
                    m: o.m % 60,
                    h: o.h % 24,
                    d: o.d
                };
        }
    } catch (e) {
        return null;
    }
};

/**
*  @param clearTimer  定时器id
*  @param time 可以是毫秒数 也可以是 日期 如 '2022-12-19 13:02:30'
*  @param goingCb  定时器正在执行时操作 用于赋值data
*  @param endCb  定时器结束的回调
*  @param type 转换类型 d、h、m、s
* @param fill 时分秒 不满两位是否自动补全
*/
let Timer = null
const customCountDown = function ({ time = 0, type = 'd', fill = true, interval = 1000, firstCall }, goingCb, endCb) {
    // 倒计时
    clearTimeout(initTimer)
    // if (Timer) clearTimeout(Timer);
    // Timer = null
    timerDiff(T => {
        // Timer = T;
        let d = DateDiff({ type: type, destination: time });
        time -= 1000;
        if (d == 'end') {
            clearTimeout(Timer);
            endCb(d, T)
        } else {
            if (fill) {
                for (let i in d) {
                    let t = d[i];
                    if (i != 'd') {
                        if (t < 10) d[i] = '0' + t;
                        else d[i] = t;
                    }
                }
            }
            goingCb(d, Timer)
        }
    }, interval, firstCall);
}


export { timerDiff, DateDiff, customCountDown }