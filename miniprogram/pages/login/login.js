// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {  
  },

  onLoad: function (options) {
    //wx.clearStorage();           // ----------------注意缓存的调试
    // wx.getStorageInfo({
    //   success: function(res) {
    //     console.log("check Storage info in login: ",res)
    //   },
    // })
    //若已经登录过则直接跳转@@@@@@@@@@@@@@@@@@@@@@@@@@@@（注意我用的“同步”）
    if (wx.getStorageSync("if-log") === true) {
      wx.switchTab({
        url: "../me/me"
      })
    }
    else{
      console.log("hi i am in else")
      //------------用云函数查看并保存openid等信息-------------//
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          console.log('callFunction login result: ', res)
          wx.setStorageSync("user-openid", res.result.openid)
        }
      })
      
    }

  },

  //调试得知提交事件在按钮绑定事件发生之前！！！但是如果没有填写完整信息表单事件不执行！
  formSubmit: function (e) {
    console.log('form发生了from submit事件，携带数据为：', e.detail.value)
    //判断输入非空
    if (e.detail.value.weixingNumber == undefined || e.detail.value.phoneNumber == undefined || e.detail.value.nickName == undefined) {
      wx.showToast({
        title: '信息不完整',
        //icon:"success",
        image: "../../images/warn_a.png",
        duration: 2000
      })
      return false;
    }
  },
  
  getInput_1: function(e) {
    let _this = this;
    _this.setData({
      nickName: e.detail.value
    })
  },
  getInput_2: function (e) {
    let _this = this;
    _this.setData({
      phoneNumber: e.detail.value
    })
  },
  getInput_3: function (e) {
    let _this = this;
    _this.setData({
      weixingNumber: e.detail.value
    })
  },

  getU: function (e) {
    console.log('发生了授权点击事件！返回e：', e)
    let _this = this;
    //-------------判断输入是否非空---------------//
    if ( _this.data.nickName== undefined ||_this.data.phoneNumber == undefined || _this.data.weixingNumber == undefined) {
      wx.showToast({
        title: '信息不完整',
        image: "../../images/warn_a.png",
        duration: 2000
      })
      return false;
    }

    var status = e.detail.errMsg;   //判断拒绝还是同意的一个状态
    if (status == 'getUserInfo:fail auth deny') {//此时用户点击了拒绝
      wx.showToast({
        title: '登陆失败！请授权！',
        icon: "none"
      })
    }
    else if (status == 'getUserInfo:ok') {  //此时用户点击了同意授权
      //------------保存微信非敏感信息数据进缓存---------------//
        wx.setStorage({
        key: 'user-Info',   
        data: e.detail.userInfo,    //缓存微信用户公开信息，
        //看到上面的截图就能看到，数据是在detail里的
        success: function (e) {      //缓存成功后，输出提示
          console.log('写入userInfo缓存成功, e :',e)
        },
        fail: function (e) {        //缓存失败后的提示
          console.log('写入userInfo发生错误, e :', e)
        }
      })

      //--------------写入缓存---------------//
      wx.setStorageSync('img-url',e.detail.userInfo.avatarUrl)
      wx.setStorageSync('if-log', true)

      wx.setStorageSync("weixingNumber", _this.data.weixingNumber);
      wx.setStorageSync("phoneNumber", _this.data.phoneNumber);
      wx.setStorageSync("nickName", _this.data.nickName);
      console.log("showing now Storage:", wx.getStorageInfoSync())
    
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
      //=----------------执行跳转-----------------------//
      wx.switchTab({    
        url: "../me/me"
      })
    }
    else{
      console("status = other ?",e.detail.errMsg)
    }
  },
  





  /**
   * 生命周期函数--监听页面加载
   */
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})