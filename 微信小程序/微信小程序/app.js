//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    

    // 登录
    wx.login({
      // success: res => {
      //   // 发送 res.code 到后台换取 openId, sessionKey, unionId
      //   var that = this;
      //   var code = res.code; //登录凭证
      //   if (code) {
      //     //2、调用获取用户信息接口
      //     wx.getUserInfo({
      //       success: function (res) {
      //         //3.请求自己的服务器，解密用户信息 获取unionId等加密信息
      //         wx.request({
      //           url: 'http://111.230.49.54:8080/paper/user/decode', //自己的服务接口地址
      //           method: 'post',
      //           data: {
      //             code: code,
      //             username: res.userInfo.nickName,
      //           },
      //           success: function (data) {
      //             //4.解密成功后 获取自己服务器返回的结果
      //             console.log(data.data.data)
      //             if (data.data.code == 20000) {
      //               that.globalData.userId = data.data.data
      //               if (that.employIdCallback) {
      //                 that.employIdCallback(data.data.data);
      //               }
      //             } else {
      //               console.log('登录失败')
      //             }
      //           },
      //           fail: function () {
      //             console.log('系统错误')
      //           }
      //         })
      //       },
      //       fail: function () {
      //         console.log('获取用户信息失败')
      //       }
      //     })
      //   } else {
      //     console.log('获取用户登录态失败！' + r.errMsg)
      //   }
      // },
      // fail: function () {
      //   console.log('登陆失败')
      // }

    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    userId:null,
  }
})