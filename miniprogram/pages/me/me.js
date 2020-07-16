const db = wx.cloud.database();
var util = require('../../utils/util.js');

const app = getApp()
//var template = require('../../template/template.js');


Page({
  data: {
    currentTab:0, //切换标签的标记
    userImg: "",
    userName: "",
    userphoneNumber:"",
    userweixingNumber:"",
    my_books : []
  },
  
  //----------------初始化用户信息---------------//
  onLoad:function(){
    wx.getStorageInfo({
      success: function (res) {
        console.log("Storage info: ", res)
      },
    })
  },
  
  onShow: function () {
    let _this = this;

    //--------如果已经登陆过，则直接从缓存中加载信息，并向数据库请求数据------------//
    if (wx.getStorageSync("if-log") === true) {
      //---------从缓存中加载用户信息------------//
      console.log("i am loading user's info")
      _this.setData({
        userImg: wx.getStorageSync("img-url"),
        userName: wx.getStorageSync("nickName"),
        userphoneNumber: wx.getStorageSync("phoneNumber"),
        userweixingNumber: wx.getStorageSync("weixingNumber")
      })
    }
    console.log("i finished initialize UserInfo in Mine :",_this.data)
    //@@@@@@@@@@@@@@@@@---向数据库请求数据---@@@@@@@@@@@@@@@@@@@//
    db.collection('all_books').where({
      _openid: wx.getStorageSync("user-openid"),
      // nickName: _this.data.userName,
      // phoneNumber: _this.data.userphoneNumber
    }).get({
      success: function (res) {
        console.log("get book_info success: res.data", res,_this.data);
        _this.setData({
          my_books: res.data
        })
      },
      fail:function(err){
        console.log("get book_info fail: res=", err);
      }

    })
    
  },
  
  //切换“我的发布”和“已完成”
  switchNav:function(e){
    var id=e.currentTarget.id;
    this.setData({currentTab:id});
  },

  
  jumpAdd: function () {
    wx.navigateTo({
      url: '../addBook/addBook',
    })
  },

//删除我的发布
  deleteBook:function(event){
    let _this = this;
    //console.log("event: ",event);
    db.collection('all_books').doc(event.currentTarget.dataset.bookId).remove({
      success: function (res) {
        console.log("success delete: ",res);
      },
      fail:function(res){
        console.log("fail delete: ", res);
      }
    })
    _this.onShow();
  }
})