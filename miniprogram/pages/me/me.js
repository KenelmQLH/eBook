const db = wx.cloud.database({
  env: 'books-info'
})
var util = require('../../utils/util.js');
const _ = db.command

const app = getApp()
//var template = require('../../template/template.js');


Page({
  data: {
    //fans: 0,
    //follow: 0,
    //likes: 0,
    currentTab:0, //切换标签的标记

    userImg: "",
    userName: "测试",
    userPhoneNumber:"测试",
    userWeixingNumber:"测试",
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@--待删掉初始信息
    my_bo0ks : []
    /*
    my_books: [{
      bookname: "数据结构",
      price: "12",
      info: "第一次测试"
    },{
        bookname: "大学物理",
        price: "13",
        info: "第2次测试，yes!"
      }, {
        bookname: "大学物理下",
        price: "13",
        info: "第3次测试，yes!"
      }]*/
    
  },
  
  //----------------初始化用户信息---------------//
  onLoad:function(){
    //template.tabbar("tabBar", 2, this)//1表示第二个tabbar
    /*
    let _this = this;
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@---向数据库请求数据---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
    //console.log("now getting  user's book_info:", _this.data);
    db.collection('all_books').where({
      // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
      nickName: "Kenelm",
      phoneNumber: "13806086411"
    }).get({
      success: function (res) {
        console.log("book_info: res.data", res.data);
        _this.setData({
          my_books: res.data
        })
      }
    })
    */
  },
  
  onShow: function () {
    let _this = this;

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
      console.log("now user's info:", _this.data);


      //------------用云函数查看openid等星系-------------//
      wx.cloud.callFunction({
        name: 'login',
        complete: res => {
          console.log('callFunction test result: ', res)
        }
      })

      console.log("_this.data: ", _this.data)
    }
    console.log("i finished initialize Page Mine")



    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@---向数据库请求数据---@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@//
    //console.log("now getting  user's book_info:", _this.data);
    db.collection('all_books').where({
      nickName: _this.data.userName,
      phoneNumber: _this.data.userPhoneNumber
    }).get({
      success: function (res) {
        console.log("book_info: res.data", res.data);
        _this.setData({
          my_books: res.data
        })
      }
    })
  },
  

  switchNav:function(e){
    var id=e.currentTarget.id;
    this.setData({currentTab:id});
  },
  showName(){
    return that.data.name;
  },
  showAuthentication(){
    return that.data.autho;
  },

  jumpAdd: function () {
    wx.navigateTo({
      url: '../addBook/addBook',
    })
  },

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
    /*
    exports.main = async (event, context) => {
      try {
        return await db.collection('todos').where({
          done: true
        }).remove()
      } catch (e) {
        console.error(e)
      }
    }
    */
  }
})