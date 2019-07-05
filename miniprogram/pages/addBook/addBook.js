// pages/addBook/addBook.js
const db = wx.cloud.database()
var util = require('../../utils/util.js');
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
    picNum: 0,  //记录发布信息时提交的照片数
    tempFilePaths: [], //暂时存储书本照片
    cloudPaths: [], //暂时存储书本照片路径

    pick_array: ['公共通修','信息与通信工程', '计算机科学与技术', '网络空间安全', '智能科学与技术','其他'],
    pick_index: "0",
  },

  /******************8----------滑动选择器---------***************/
  //----------滑动带改变事件------------//
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let _this = this;
    _this.setData({
      pick_index: e.detail.value
    })
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
    //console.log("inputValues now: ", this.data.inputValues)
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
        
        //更新修改过的数据!!!!!!!!!!!!!!!!!!!!!!!
        _this.setData({
          picNum: picNum,
          tempFilePaths: tmpfiles,
        })
        //console.log("_this.data.tempFilePaths 333", _this.data.tempFilePaths)
        //console.log("_this.data.cloudPaths", _this.data.cloudPaths)

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
    let _this = this;
    //---------------判断非空--------------------//
    //这里可能有问题，也许不能直接读取信息
    //console.log("e.detail: ", e.detail.value);
    if (e.detail.value.bookName == undefined || e.detail.value.price == undefined || e.detail.value.bookInfo == undefined || _this.data.picNum == 0) 
    {
      wx.showToast({
        title: '信息不完整',
        //icon:"success",
        image: "../../images/warn_a.png",
        duration: 2000
      })
      return false;
    }
    //console.log('form发生了submit事件，携带数据为：',this.data.bookName,this.data.price, this.data.bookInfo)
    //--------------开始上传数据----------------//
    wx.showLoading({
      title: '上传中',
    })
    _this.setData({
      bookName: e.detail.value.bookName,
      price: e.detail.value.price,
      bookInfo: e.detail.value.bookInfo
    })

    //------------------上传照片-------------------//
    ////////////////////-----------更新云存储路径----------/////////////////////////////////
    //console.log("wx.getStorage('if-log'): ", wx.getStorageSync("if-log"))
    //console.log("Storage infos: ", wx.getStorageInfoSync())
    let time = util.formatTime(new Date());
    time = String(time)
    time = time.replace("/", "")
    time = time.replace("/", "")
    time = time.replace("/", "")
    time = time.replace(" ", "")
    time = time.replace(":", "")
    time = time.replace(":", "")
    console.log("now time= ", time, ",type", typeof time)


    let id = wx.getStorageSync("phoneNmber") + wx.getStorageSync("nickName");
    for (let i = 0; i < _this.data.picNum; i++) {
      _this.data.cloudPaths[i] = "bookPic/" + id +"/"+_this.data.bookName+ time +"pic" + i + ".png";
      //需要给云指定一个标识!!!！！！！！！！！！！！！！！！！！！！！!!!!!!@@@@@@@??????
    }

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
            console.log("a res succuss: ", res);
          },
          fail: function (res) {
            console.log("a res fail: ", res);
          }
        })
      })
    }
        /*
        Promise.all(uploads).then((result) => {
          resolve(result)
        })
        */
    
    //------------------添加发布信息的记录-----------------------------//
    db.collection("all_books").add({
      // data 字段表示需新增的 JSON 数据
      data: {
        //书的信息
        bookname: _this.data.bookName,
        info: _this.data.bookInfo,
        price: _this.data.price,
        //用户信息
        phoneNumber: wx.getStorageSync("phoneNumber"),
        weixingNumber: wx.getStorageSync("weixingNumber"),
        nickName: wx.getStorageSync("nickName"),
        //due: new Date(),//多加了一个日期？？？用法得查下
        sold: false, //是否已售
        picPaths: _this.data.cloudPaths,
        //例："cloud://books-info-mqg58.626f-books-info-mqg58-1259521396/bookPic/pic_a0.png"
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(" i success here: ", res)
        console.log("finish data_upload here")
      },
      fail: function (res) {
        console.log(" i am losted here: ", res)
      }
    })
    ////////////////////////////////////////////////////////////////////////
    //----------------------结束提示、跳转--------------------------//
    setTimeout(function () {
      wx.hideLoading();

      wx.navigateBack({  //回到“我的”页面
        url: '../me/me',
        success: function () {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 1000
          })
        }
      })
    }, 2000)
  }



/*
    console.log("start data_upload")
    
    
    //pick_array: ['公共通修','信息与通信工程', '计算机科学与技术', '网络空间安全', '智能科学与技术','其他'],
    //console.log("now checking _this.data.pick_index: ", _this.data.pick_index);
    //console.log("now checking _this.data ", _this.data);
    console.log("_this.data.pick_index === 0", _this.data.pick_index === 0);
    console.log("type _this.data.pick_index", typeof _this.data.pick_index);

    let bookClass = ["public", "communicateEngineer", "computerScience", "cyberSecure", "intelligienceScience", "others"];
    let book_index = parseInt(_this.data.pick_index);
    let booksnum = 0;
    let book_id = "";

    console.log("type book_index", typeof book_index, "book_index=",book_index);
    console.log("i am adding a book class->", bookClass[book_index]);

    ///////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////
    db.collection(bookClass[book_index]).where({
      bookname: _this.data.bookName
    }).get({
      success: function (res) {
        // res.data 包含该记录的数据
        console.log("show the public book data", res, res.data)
        booksnum = res.data.length;
        console.log("real booksnum=", booksnum);
        if (booksnum > 0) book_id = res.data[0]._id;  //返回书名的id

        ///////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////
        console.log("type of booksnum:", typeof booksnum, "booksnum:", booksnum)
        console.log("checking if in if booksnum > 0");
        
        if (booksnum == 0) {
          console.log("now set init num == 1")
          db.collection(bookClass[book_index]).add({
            data: {
              bookname: _this.data.bookName,
              num: 1,
            },
            success: function (res) {
              console.log("success add a book-collection: ", res)
          
              
              ///////////////////////////////////////////////////////////////////
              ///////////////////////////////////////////////////////////////////////
              
        console.log("checking again real booksnum=", booksnum);
        console.log("checking booksnum > 0", booksnum > 0);
        
        if (booksnum > 0) {
          console.log("now adding num")
          console.log("now book_id", book_id)
          db.collection(bookClass[book_index]).doc(book_id).update({
            // data 传入需要局部更新的数据
            data: {
              num: _.inc(1)
            },
            success: function (res) {
              console.log("success adding num", res.data)

              ///////////////////////////////////////////////////////////////////
              //////////////////////////////////////////////////////////////////////////
              db.collection("all_books").add({
                // data 字段表示需新增的 JSON 数据
                data: {
                  // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                  bookname: _this.data.bookName,
                  info: _this.data.bookInfo,
                  price: _this.data.price,
                  //用户信息
                  phoneNumber: wx.getStorageSync("phoneNumber"),
                  weixingNumber: wx.getStorageSync("weixingNumber"),
                  nickName: wx.getStorageSync("nickName"),
                  //due: new Date(),//多加了一个日期？？？用法得查下
                  sold: false, //是否已售
                  picPaths: _this.data.cloudPaths,
                  //例："cloud://books-info-mqg58.626f-books-info-mqg58-1259521396/bookPic/pic_a0.png"
                },
                success: function (res) {
                  // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                  console.log(" i success here: ", res)
                  console.log("finish data_upload here")


                  //------------------上传照片-------------------//

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
                          console.log("a res succuss: ", res);
                        },
                        fail: function (res) {
                          console.log("a res fail: ", res);
                        }
                      })
                    })//.then(function (res) { console.log("a cloudpath res : ", res);})
                  }
                  
                  //Promise.all(uploads).then((result) => {
                  //  resolve(result)
                  //})
                  
                  /////////////////////////////////////////////////////////////////////
                  //----------------------结束提示、跳转--------------------------//
                  setTimeout(function () {
                    wx.hideLoading();

                    wx.navigateBack({  //回到“我的”页面
                      url: '../mine/mine',
                      success: function () {
                        wx.showToast({
                          title: '成功',
                          icon: 'success',
                          duration: 1000
                        })
                      }
                    })
                  }, 2000)
                },
                fail: function (res) {
                  console.log(" i am losted here: ", res)
                }
              })


            }
          })
        }

      },
      fail: function (res) {
        console.log("i fail", res.data)
      }
    })

    console.log("finish data_upload......")
  },*/

  
})
