// pages/demo-search/demo-search.js

var WxSearch = require('../../wxSearch/wxSearch.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onsearch:null,
    currentkey:null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    console.log('onLoad');
     //template.tabbar("tabBar", 2, this)//1表示第二个tabbar
    this.setData({
      onsearch:false
    })
    var that = this;
      //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['高等数学', '线性代数', '算法设计与分析', '信号与系统']);
    WxSearch.initMindKeys(['高等数学', '线性代数', '算法设计与分析', '信号与系统', '中国近代史纲要']);
  },

  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
  },

  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },

  wxSearchFocus: function (e) {
    this.setData({
      onsearch: true
    })
    var that = this;
    WxSearch.wxSearchFocus(e, that);
  },

  wxSearchBlur: function (e) {
    this.setData({
      onsearch:false
    })
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },

  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },

  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },

  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },

  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  getlist:function(e){
    let tagname = e.currentTarget.id;
    console.log(tagname);
    wx.navigateTo({
      url: '../demo-list/demo-list?bookclass='+tagname,
      success:function(res){
        console.log(res);
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