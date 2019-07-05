// pages/demo-list/demo-list.js

const db = wx.cloud.database({
  env: 'books - info - mqg58'
}
)

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    group_list:[],
    tagname:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let bookclass = options.bookclass;
    if (bookclass === "computerScience"){
      that.setData({
        tagname: "计算机科学与技术",
        group_list:["计算机科学与技术导论","计算机图形学","Linux程序设计","计算机组成原理","编译原理"]
      })
    }
    else if (bookclass === "communicateEngineer"){
      that.setData({
        tagname: "信息与通信工程",
        group_list: ["微分方程", "微波分析", "长波分析", "短波分析", "集成电路设计"]
      })
    }
    else if (bookclass === "cyberSecure") {
      that.setData({
        tagname: "网络空间安全",
        group_list: ["网络空间安全导论", "现代密码学", "近世代数", "区块链技术", "数据擦除与数据恢复"]
      })
    }
    else if (bookclass === "intelligenceScience") {
      that.setData({
        tagname: "智能科学与技术",
        group_list: ["智能科学导论", "数据挖掘与数据仓库", "Linux内核分析", "非经典计算", "虚拟现实技术"]
      })
    }
    else if (bookclass === "others") {
      that.setData({
        tagname: "其他",
        group_list: ["乌合之众", "中国震撼", "恶意", "编程珠玑", "马克思靠谱"]
      })
    }
    else if (bookclass === "public") {
      that.setData({
        tagname: "公共/通修",
        group_list: ["高等数学", "线性代数", "毛泽东思想与中国特色社会主义概论", "马克思主义原理", "中国近代史纲要"]
      })
    }
    console.log(that.data.group_list)
  },
  linktosearch:function(e){
    app.data.onsearch_name = e.target.dataset.src;
    console.log(app.data.onsearch_name);
    wx.navigateTo({
      url: '../index/index',
      success: function (res) {
        console.log(res)
      }
    })
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