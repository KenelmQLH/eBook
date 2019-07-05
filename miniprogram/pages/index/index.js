// pages/index/index.js
const db = wx.cloud.database()
const app = getApp()
Page({
  /**
  * 页面的初始数据
  */
  data: {
    ifhave:false,
    ifshowed:null,
    mybook: [],
    tempFilePaths:[],
    imgUrls: [
      {
        link: '/pages/index/index',
        url: '../../images/b1.jpg'
      }, {
        link: '/pages/logs/logs',
        url: '../../images/b2.jpg'
      }, {
        link: '/pages/index/index',
        url: '../../images/b3.jpg'
      }
    ],
    indicatorDots: true,  //小点
    autoplay: true,  //是否自动轮播
    interval: 4000,  //间隔时间
    duration: 1000,  //滑动时间
  },
  large:function(e) {
    let _this = this;
    let _tmp = [];
    let book = _this.data.mybook;
    let showed = _this.data.ifshowed;
    if (!showed)
    {
      for (let i = 0; i < book.length; i++) {
        if (book[i].hasOwnProperty("picPaths") !== false && book[i].picPaths.length > 0) {
          for (let j = 0; j < book[i].picPaths.length; j++) {
            _tmp.push('cloud://books-info-mqg58.626f-books-info-mqg58/' + book[i].picPaths[j]);
          }
        }
      }
      _this.setData({
        ifshowed:true,
        tempFilePaths:_tmp
      })
    }
    const current = 'cloud://books-info-mqg58.626f-books-info-mqg58/'+ e.target.dataset.src;
    const images = this.data.tempFilePaths;
    wx.previewImage({
      current: current,  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    let _this = this;
    _this.setData({
      ifshowed:false,
    })
    //-----------load info---------------//
    db.collection('all_books').where({
      bookname: app.data.onsearch_name,
    })
      .get({
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log("data：", res.data)
          _this.setData({
            mybook: res.data
          })
          if (_this.data.mybook.length > 0){
            _this.setData({
              ifhave: true
            })
          }
        }
      })
    /*
    let bookname = app.data.onsearch_name;
    wx.cloud.callFunction({
      name: 'getbookinfo',
      data: {
        searchname: { bookname }
      },
      success: function (res) {
        console.log(11111)
        console.log(res.result)
      },
      fail: console.error
    })
    */
  },


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