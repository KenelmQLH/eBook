// pages/addBook/addBook.js
const db = wx.cloud.database()


Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',

    bookName :"",//书籍信息
    price :"",
    bookInfo :"",

    picNum: 0,
    tempFilePaths: [], //暂时存储书本照片
    cloudPaths: [], //暂时存储书本照片路径
  },

  /*------------收集书籍信息-------------*/

  /*
  onLoad: function () {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
  },
  */
  // ---------------选择图片----------------------//
  chooseImg: function () {
    console.log("inputValues now: ", this.data.inputValues)
    // 选择图片
    let _this = this;
    wx.chooseImage({
      count: 4,/*最多可选4张*/
      sizeType: ['compressed'], //压缩图
      sourceType: ['album', 'camera'],
      success: function (res) {
        //console.log("res", res)
        //console.log("file number: " + res.tempFilePaths.length)
        
        let tmpfiles = _this.data.tempFilePaths;
        /*注意data里面的tempFilePaths和res返回的tempFilePaths不同*/
        tmpfiles = tmpfiles.concat(res.tempFilePaths) //添加照片
        //console.log("_this.data.tempFilePaths 111", tmpfiles)
        
        if (tmpfiles.length > 4){
          tmpfiles = tmpfiles.slice(0, 4) 
        }//限制总共最多4张照片
        //console.log("_this.data.tempFilePaths 222", tmpfiles)

        let picNum = tmpfiles.length;//更新照片数量
        //console.log("picNum",picNum)
        ////////////////////-----------更新云存储路径----------/////////////////////////////////
        let id = wx.getStorageSync("weixingNmber") + wx.getStorageSync("nickName");
        for (let i = 0; i < picNum; i++) {
          _this.data.cloudPaths[i] = "bookPic/" + id +"pic" +i + ".png"; 
          //需要给云指定一个标识!!!！！！！！！！！！！！！！！！！！！！！!!!!!!@@@@@@@??????
        }
        //更新修改过的数据!!!!!!!!!!!!!!!!!!!!!!!
        _this.setData({
          picNum: picNum,
          tempFilePaths: tmpfiles,
          cloudPaths: _this.data.cloudPaths  //必须显示setData
        })
        console.log("_this.data.tempFilePaths 333", _this.data.tempFilePaths)
        console.log("_this.data.cloudPaths", _this.data.cloudPaths)

      },
      fail: e => {
        console.error(e)
      }
    })
  
  },
  //---------------删除图片---------------//
  removeImage(e) {
    let _this = this;
    const idx = e.target.dataset.idx
    //console.log("this.data.tempFilePaths", _this.data.tempFilePaths)

    //console.log("idx",idx)

    //神奇的错误！！注意splice返回的是切下来的数组！！let files = _this.data.tempFilePaths.splice(idx, 1);//坑人不浅啊啊啊啊啊啊！！！！
    let files = _this.data.tempFilePaths;
    files.splice(idx, 1);
    let cloudfiles = _this.data.cloudPaths;
    cloudfiles.splice(idx, 1);

    //console.log("???files", files);
    _this.setData({
      tempFilePaths: files,//从idx开始删除1个元素
      cloudPaths: cloudfiles,
      picNum: _this.data.picNum-1,
    })
    //console.log("???_this.data.tempFilePaths", _this.data.tempFilePaths)
  },
  
  //-----------------预览图片---------------------//
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.tempFilePaths
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },



  //------------------提交表单------------------//
  formSubmit: function (e) {
    //---------------判断非空--------------------//
    //这里可能有问题，也许不能直接读取信息
    console.log("e.detail: ", e.detail.value.bookName);
    console.log("e.detail: ", e.detail.value.price);
    console.log("e.detail: ", e.detail.value.bookInfo);

    if (e.detail.value.bookName == undefined || e.detail.value.price == undefined || e.detail.value.bookInfo == undefined || this.data.picNum == 0) 
    {
      wx.showToast({
        title: '信息不完整',
        //icon:"success",
        image: "../../images/warn_a.png",
        duration: 2000
      })
      return false;
    }
    //--------------开始上传数据----------------//
    wx.showLoading({
      title: '上传中',
    })
    this.setData({
      bookName: e.detail.value.bookName,
      price: e.detail.value.price,
      bookInfo: e.detail.value.bookInfo
    })
    
    console.log('form发生了submit事件，携带数据为：',this.data.bookName,this.data.price, this.data.bookInfo)
    
    //------------------上传照片-------------------//
    let _this = this;
    //应该可以删掉
    wx.showLoading({
      title: '上传中',
    })
    let files = _this.data.tempFilePaths;
    let cloudfiles = _this.data.cloudPaths;
    let uploads = [];

    for (let i = 0; i < files.length; i++) {
      uploads[i] = new Promise((resolve, reject) => {
        wx.cloud.uploadFile({
          cloudPath: cloudfiles[i], //仅为示例，非真实的接口地址
          filePath: files[i],

          success: function (res) {
            resolve(res);
            console.log("a cloudpath res : ", res);
          },
          fail :function(res){
            console.log("a res : ", res);
          }
        })
      })
    }
    /*
    Promise.all(uploads).then((result) => {
      resolve(result)
    })
    */
    console.log("start data_upload")
    db.collection("all_books").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        bookname: this.data.bookName,
        info: this.data.bookInfo,
        price: this.data.price,
        //用户信息
        phoneNumber: wx.getStorageSync("phoneNumber"),
        weixingNumber: wx.getStorageSync("weixingNumber"),
        nickName: wx.getStorageSync("nickName"),
        //due: new Date(),//多加了一个日期？？？用法得查下
        sold: false , //是否已售
        picPaths: this.data.cloudPaths,
        //例："cloud://books-info-mqg58.626f-books-info-mqg58-1259521396/bookPic/pic_a0.png"
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(" i success : ",res)
      },
      fail:function(res){
        console.log(" i am losted : ", res)
      }
    })
    console.log("finish data_upload")
    //----------------------结束提示、跳转--------------------------//
    setTimeout(function () {
      wx.hideLoading();

      wx.navigateBack({  //回到“我的”页面
        url: '../mine/mine',
        success: function(){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }, 2000)
  },

  uploadAll: function() {
    /*
    let _this = this;
    //应该可以删掉
    wx.showLoading({
      title: '上传中',
    })

    let files = tempFilePaths;
    let cloudfiles = _this.data.cloudPaths;
    let uploads = [];

    for (let i = 0; i < files.length; i++) {
      uploads[i] = new Promise((resolve, reject) => {
        wx.uploadFile({
          url: cloudfiles[i], //仅为示例，非真实的接口地址
          filePath: files[i],
          success: function (res) {
            resolve(res)
          }
        })
      })

    }
    Promise.all(uploads).then((result) => {
      resolve(result)
    })
    */
  }
  

})
