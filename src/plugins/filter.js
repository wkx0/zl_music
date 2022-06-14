import Vue from 'vue'
import Moment from 'moment'
//播放量过滤器
Vue.filter("numToInteger",function (num){
  let playCount = parseInt(num)
  if (num>10000){
    let integer  = Math.floor(playCount/10000);
    return integer+"万"
  }else {
    return num
  }
})
//全局过滤器(毫秒秒数转化为分钟)
Vue.filter('timeFormat', function(time) {
        //分钟
        //毫秒转秒
        time = time /1000
        var minute = time / 60;
        var minutes = parseInt(minute);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        //秒
        var second = time % 60;
        var seconds = Math.floor(second);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return `${minutes}:${seconds}`;
    })
//全局vue过滤器(时间戳过滤器) 2021-11-06 11:06:20
Vue.filter('dateFormat', function(originVal) {
    return Moment(originVal).format('YYYY-MM-DD HH:mm:ss')
})
Vue.filter('dateFormatMD', function(originVal) {
    return Moment(originVal).format('MM月DD日')
})
//verify
