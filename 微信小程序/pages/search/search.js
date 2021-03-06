// pages/search/search.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yhid:1,//用户id
    lwid:0,//论文id
    collection:"../img/star.png",//收藏五星图片
    collectionSelected: "../img/star-selected.png",//收藏五星图片
    num:0,//保存返回了多少篇文章
    str:"",  //用户输入的关键字
    list:[], //保存客户端返回的数据
    code:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {/**鬼鬼鬼鬼鬼***/
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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

  },

  getkey: function (event) {//键盘输入时触发,相当于时刻保存输入的关键字
    this.setData({
      str:event.detail.value
    })
  },

  getList: function (event) {//暂时先保存相应的关键字
    var THIS = this
    var str = THIS.data.str
    var yhid = 1
    var input = this.data.str;//input就是用户输入的关键字
    
    wx.request({//搜索发送用户id和关键词
      url: 'http://111.230.49.54:8080/paper/paper/' + yhid+'/' + str,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //发关键字给后台（已删除）
        //wx.request({
        //  url: "http://111.230.49.54:8080/paper/paper/downLoad/"+str,
        //  method: "GET",
        //});
        var data = res.data.data;
        THIS.setData({
          list: data,
          num: data.length,
        });
        wx.hideNavigationBarLoading();
        wx.setNavigationBarTitle({
          title: '搜索结果',
        })
      }
    })
    wx.showNavigationBarLoading();
  },
  clear:function(){
    this.setData({
      str:""
    })
  },
  getDetail:function(event){//当点击到标题或者head时跳转到预览界面
    var lwid = event.currentTarget.dataset.lwid;//获取论文id***
    var current_date = util.formatgetDate(new Date());//获取当前日期***
    var current_time = util.formatgetTime(new Date());//获取当前时间***
    var title = event.currentTarget.dataset.title;//获取标题***
    var file = event.currentTarget.dataset.file;//获取论文名***
    var net = event.currentTarget.dataset.net;//获取net
    //var lwContent = event.currentTarget.dataset.title;//获取内容***
    //发送用户id，论文id，点击时间，标题给后台当做历史记录
    //console.log("发送历史记录的东东"+lwid + ":" + current_date + " " + current_time+":"+title);
    wx.request({
      url: "http://111.230.49.54:8080/paper/history",
      method: "POST",
      data: {
        "yhid": 1,//用户id
        "lwid": lwid,//论文id
        "browDate": current_date + " " + current_time,
        "title": title
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {//成功，也没什么显示
        
      }
    })
    wx.getStorage({
      key: 'date',
      success:function(res){
        console.log(res.data);
      }
    })
    //传递论文id，论文日期，作者，内容，跳转到detail页面
    var lwid = event.currentTarget.dataset.lwid;
    var date = event.currentTarget.dataset.date;
    var author = event.currentTarget.dataset.author;
    var lwContent = event.currentTarget.dataset.lwContent;
    var file = event.currentTarget.dataset.file;
    var net = event.currentTarget.dataset.net;
    wx.navigateTo({
      url: '/pages/detail/detail?lwid='+lwid+'&title=' + title + '&date=' + date + '&author=' + author + '&lwContent=' + lwContent+'&file=' + file + '&net=' + net,//传递参数用&做分隔符     
    })
  },
  ToColletcion:function(event){//每次点击时，改变它的收藏状态
    var THIS = this;
    var mark = event.currentTarget.dataset.mark;
    var index = event.currentTarget.dataset.index;
    var str = "list.[" + index + "].iscollect";
    if(mark!=0){//如果已经收藏了，再次点击取消收藏
      THIS.setData({
        [str]:0
      })
      //向服务端发送用户id，论文id，当做收藏夹
      var lwid = event.currentTarget.dataset.lwid;//论文id
      //console.log("发送取消收藏的东东："+lwid);
      wx.request({
        url: "http://111.230.49.54:8080/paper/collection/del",
        method: "POST",
        data: {
          "yhid": 1,//用户id
          "lwid": lwid,//论文id
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {//成功，也没什么显示

        }
      })
    }
    if(mark==0){//如果点击收藏，星星点亮
      THIS.setData({
        [str]:1
      })
      //向服务端发送用户id，论文id，论文标题，论文作者，当前时间，当做收藏夹
        var lwid = event.currentTarget.dataset.lwid;//论文id
        var title = event.currentTarget.dataset.title;//获取标题***
        var author = event.currentTarget.dataset.author;//获取作者
        var current_date = util.formatgetDate(new Date());//获取当前日期***
        var current_time = util.formatgetTime(new Date());//获取当前时间***
      //console.log("发送收藏的东东：" + lwid + ":" + title + ":" + author + ":" + current_date + " " + current_time);
        wx.request({
          url: "http://111.230.49.54:8080/paper/collection",
          method: "POST",
          data: {
            "yhid": 1,//用户id
            "lwid": lwid,//论文id
            "lwTitle": title,//论文标题
            "lwAuthor": author,//论文作者
            "createdTime": current_date + " " + current_time,//当前日期
          },
          header: {
            'Content-Type': 'application/json'
          },
          success: function (res) {//成功，也没什么显示

          }
        })
    }
  }
})