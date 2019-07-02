// pages/mine/mine.js
var app = getApp(); //导入全局变量

const db = wx.cloud.database({
  env: 'books-info'
})

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userImg: "",
    userName: "",
    my_books: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  //----------------初始化用户信息---------------//
  onReady: function () {
  
    let _this = this;
    console.log("wx.getStorage('if-log'): ", wx.getStorageSync("if-log"))
    console.log("Storage infos: ",wx.getStorageInfoSync())
    
    //-------------如果已经登陆过，则直接从缓存中加载信息，并向数据库请求数据----------------//
    if (wx.getStorageSync("if-log") === true) {

      //---------从缓存中加载用户信息------------//
      console.log("i am loading user's info")
      _this.setData({
        userImg: wx.getStorageSync("img-url"),
        userName: wx.getStorageSync("nickName"),
        userPhoneNumber: wx.getStorageSync("phoneNumber"),
        userWeixingNumber: wx.getStorageSync("weixingNumber")
      })
      console.log("now user's info:",_this.data);
      //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@---向数据库请求数据---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
      db.collection('all_books').where({
        // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
        nickName: "Kenelm",
        phoneNumber:"13806086411"
      }).get({
          success: function (res) {
            console.log("res.data",res.data);
            _this.setData({
              mybooks : res.data
            })
          }
        })

      console.log("_this.data: ", _this.data)
    }
    console.log("i finished initialize Page Mine")
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

  },
  jumpAdd: function () {
    wx.navigateTo({
      url: '../addBook/addBook',
    })
  }
})