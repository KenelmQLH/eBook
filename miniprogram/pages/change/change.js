Page({
  data: {
    focus: false,
    inputValue: '',
    weixingNumber:'',
    phoneNumber:'',
    nickName:'',
    meterNo: '个人信息',
    userImg: wx.getStorageSync("img-url"),
  },

  //-------------值得注意的是只是修改了本地的信息--------------//
  formSubmit: function (e) {
    var that = this;
    console.log(" i am in,e = ",e)
    
    if (e.detail.value.weixingNumber.length == 0 || e.detail.value.phoneNumber.length == 0 || e.detail.value.nickName.length == 0) {
      wx.showToast({
        title: '信息不完整',
        image: "../../images/warn_a.png",
        duration: 2000
      })
      return false;
    }
    wx.setStorageSync("weixingNumber", e.detail.value.weixingNumber);
    wx.setStorageSync("phoneNumber", e.detail.value.phoneNumber);
    wx.setStorageSync("nickName", e.detail.value.nickName);

    console.log("change weixingNumber :", e.detail.value.weixingNumber)
    console.log("change phoneNumber", e.detail.value.phoneNumber)
    console.log("change nickName", e.detail.value.nickName)

    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    //=----------------执行跳转-----------------------//
    wx.navigateBack({
      url: "../me/me"
    })
  },

})