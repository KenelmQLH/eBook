Page({
  data: {
    focus: false,
    inputValue: '',
    weixingNumber:'',
    phoneNumber:'',
    nickName:'',
    meterNo: '个人信息',
  },


  formSubmit: function (e) {
    var that = this;
    wx.showModal({ //提交修改提示框
      title: '修改',
      content: '确定修改' + that.data.meterNo,//修改提示框标题
      success: function (res) {
        if (res.confirm) {
          //提示框确定以后

          app.request('/rest/meter/edit',
            {
              //请求封装
            },
            'POST',
            function (res) {
              if (res.data.result) {
                wx.showToast({
                  title: '修改成功',
                  icon: 'none',
                  duration: 3000,
                  mask: false,
                  success: function () {
                    //请求成功弹窗

                  },
                })

              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 3000,
                  mask: false,
                  success: function () {
                    //请求失败弹窗
                  },
                })
              }
            }, function () {
              //console.log("失败")
            }
          );
        } else if (res.cancel) {
          //console.log('用户点击取消')
        }
      }
    })
    wx.setStorageSync("weixingNumber", e.detail.value.weixingNumber);
    wx.setStorageSync("phoneNumber", e.detail.value.phoneNumber);
    wx.setStorageSync("nickName", e.detail.value.nickName);

    console.log("weixingNumber :", e.detail.value.weixingNumber)
    console.log("phoneNumber", e.detail.value.phoneNumber)
    console.log("nickName", e.detail.value.nickName)
  },

})