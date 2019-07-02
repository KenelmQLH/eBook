// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
  },

  onLoad: function (options) {
    wx.clearStorage();           // ----------------注意缓存的调试
    wx.getStorageInfo({
      success: function(res) {
        console.log("Storage info: ",res)
      },
    })
    
    //若已经登录过则直接跳转
    if (wx.getStorageSync("if-log") === true) {
      wx.switchTab({
        //wx.navigateTo会形成父子级关系，wx.switchTab是同级
        url: "../mine/mine"
      })
    }
    
    /*
     wx.getSetting({
       success(res) {
         console.log("2222");
         console.log("if res.authSetting['scope.userInfo']???",res.authSetting['scope.userInfo'])
         if (!res.authSetting['scope.userInfo']) {
           console.log("3333");
           wx.authorize({
             scope: 'scope.userInfo',
             success() {
               console.log("4444");
               // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
               wx.getUserInfo({
                 success: function (res) {
                   //--------------写入缓存---------------//
                   let userInfo = res.userInfo
                   wx.setStorageSync('img-url', userInfo.avatarUrl)
                   wx.setStorageSync('nick-name', userInfo.nickName)
                   wx.setStorageSync('if-log', true)
 
                   console.log("Storage img-url: ", wx.getStorageSync("img-url"))
                   console.log("Storage nick-name: ", wx.getStorageSync("nick-name"))
                   console.log("Storage if login?", wx.getStorageSync("if-log"))
 
                 }
               });
               console.log("5555");
             }
 
           })
         }
         else{
           wx.switchTab({     //先获取到用户信息，在执行跳转，
             //wx.navigateTo会形成父子级关系，wx.switchTab是同级
             url: "../mine/mine"
           })
         }
       }
 
     })
     */
  },

  //调试得知提交事件在按钮绑定事件之前！！！但是如果没有填写完整信息表单事件不执行！
  formSubmit: function (e) {
    console.log("i am in formsubmit")
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
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
    /*
    //-------存入缓存-------------//
    wx.setStorageSync("weixingNumber", e.detail.value.weixingNumber);
    wx.setStorageSync("phoneNumber", e.detail.value.phoneNumber);
    wx.setStorageSync("nickName", e.detail.value.nickName);

    console.log("weixingNumber :", e.detail.value.weixingNumber)
    console.log("phoneNumber", e.detail.value.phoneNumber)
    console.log("nickName", e.detail.value.nickName)
    */
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
    let _this = this;
    if ( _this.data.nickName== undefined ||_this.data.phoneNumber == undefined || _this.data.weixingNumber == undefined) {
      wx.showToast({
        title: '信息不完整',
        //icon:"success",
        image: "../../images/warn_a.png",
        duration: 2000
      })
      return false;
    }

    console.log("发生了授权点击事件！")
    console.log('e：',e)
    console.log(e.detail.errMsg)
    var status = e.detail.errMsg;//判断拒绝还是同意的一个状态
    if (status == 'getUserInfo:fail auth deny') {//此时用户点击了拒绝
      wx.showToast({
        title: '登陆失败！',
        icon: "none"
      })
    }
    else if (status == 'getUserInfo:ok') {//此时用户点击了同意授权
      //------------保存数据进缓存---------------//
      

      wx.setStorage({    //数据缓存方法
        key: 'user_key',   //关键字，本地缓存中指定的key
        data: e.detail.userInfo,    //缓存微信用户公开信息，
        //看到上面的截图就能看到，数据是在detail里的
        success: function () {      //缓存成功后，输出提示
          console.log('写入userInfo缓存成功')
        },
        fail: function () {        //缓存失败后的提示
          console.log('写入userInfo发生错误')
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
        //wx.navigateTo会形成父子级关系，wx.switchTab是同级
        url: "../mine/mine"
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