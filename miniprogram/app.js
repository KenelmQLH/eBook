//app.js
App({
  //定义一个获取登录天数的函数
  getDayNum: function(timestamp) {
    let time = new Date().getTime();
    let timeDiff = time - timestamp;    //上一次的时间戳怎么办。。。。。。。。。。。。。。
    let dayNum = timeDiff / (1000 * 60 * 60 * 24)
    return dayNum;
  },

  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env:"books-info-mqg58",
        traceUser: true,
      })
    }
    /*检查用户登陆态，不知道是不是要放在这里，貌似不太搭
    wx.checkSession({
      success() {
        console.log("此时登陆态有效，可以解析encryptedData")
      },
      fail() {
        console.log("此时登陆态失效，需要重新登陆")
        login.login(0)
      }
    })
    */
    //用户已经登陆并且三天之内登陆的，会主动跳转，否则就得重新登陆了
    if (wx.getStorageSync("ifLog") && time.GetDayNum(wx.getStorageSync("timeStamp")) < 3) {
      wx.switchTab({
        url: 'pages/mine/mine'
      })
    }


    this.globalData = {}  //全局变量
  }
})
