//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "../../pages/books/books",
      "text": "旧书",
      "iconPath": "../../images/books_dis.png",
      "selectedIconPath": "images/books.png"
    },
    {
      "current": 0,
      "pagePath": "../../pages/addBook/addBook",
      "iconPath": "../../imgs/category.png",
      "selectedIconPath": "/imgs/category_on.png",
      "text": "分类"
    },
    
    {
      "current": 0,
      "pagePath": "../../pages/me/me",
      "text": "我的",
      "iconPath": "../../images/home_dis.png",
      "selectedIconPath": "../../images/home.png"
    }
  ]

}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}
/*
function jump0(e){
  wx.switchTab({
    url: "../pages/books/books"
  })
}

function jump1(e) {
  wx.switchTab({
    url: "../pages/me/me"
  })
}
function jump2(e) {
  wx.switchTab({
    url: "../pages/books/books"
  })
}
*/
module.exports = {
  tabbar: tabbarmain
}