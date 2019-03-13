const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'cloud://dev-513b66.6465-dev-513b66/avatarUrl/user-unlogin.png',
    logged: false,
    userInfo: {}
  },


  goLogin(){
    const that = this;
    // const userInfo = {};
    wx.getUserInfo({
      success: data => {
        console.log('userInfo:',data.userInfo);
        const { nickName, gender, avatarUrl } = data.userInfo;
        //登录
        wx.login({
          success(res) {
            if (res.code) {
              // 调用云函数
              wx.cloud.callFunction({
                name: 'getSession_key',
                data: {
                  code: res.code,
                  nickName,
                  gender,
                  avatarUrl,
                },
                success: result => {
                  console.log('登录成功,skey:',result);
                  //获取用户信息
                  that.getUserInfo();
                  //将skey存入storage
                  try {
                    wx.setStorageSync('skey',result.result.skey);
                  } catch (e) {
                      console.log(e);
                  }
                },
                fail: err => {
                  console.log(err);
                }
              })
            }
            else{
              console.log('登录失败！' + res.errMsg)
            }
          }
        })
            
      }
    })

  },

  checkLogin(){
    const that = this;
    wx.checkSession({
      success(e){
        //登录未过期
        console.log('您已登录,session_key未过期');
        //获取用户信息
        that.getUserInfo();
      },
      fail(){
        console.log('您未登录或session_key已过期');
        //未登录或登录过期，重新登陆
        // that.goLogin();
      }
    })

  },

  getUserInfo(){
    wx.getUserInfo({
      success: res => {
        console.log('用户信息：',res);
        this.setData({
          avatarUrl: res.userInfo.avatarUrl,
          userInfo: res.userInfo,
          logged: true
        })
      }
    })
  },

  toUserInfo(){
    wx.navigateTo({
      url: '../userInfo/userInfo'
    })
  },

  toGoodsList(){
    wx.navigateTo({
      url: '../goodsList/goodsList'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    try {
      const value = wx.getStorageSync('skey')
      if (value) {
        //存在skey，检查session_key是否过期
        console.log('存在skey');
        this.checkLogin();
      }else{
        console.log('您未登录');
        //没有skey，用户未登录
        // this.goLogin();
      }
    } catch (e) {
      console.log(e)
    }
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