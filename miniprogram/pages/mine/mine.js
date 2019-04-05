import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: 'cloud://dev-513b66.6465-dev-513b66/avatarUrl/user-unlogin.png',
    logged: false,
    userInfo: {},
    showLoading: false
  },

  bindGetUserInfo(e){
    Dialog.confirm({
          title: '提示',
          message: '点击确定进行登录'
        }).then(() => {
          this.goLogin(e.detail.userInfo);
        });

  },

  goLogin(userInfo){
    const that = this;
    this.setData({
      showLoading: true
    })
    console.log('userInfo:',userInfo);
    const { nickName, gender, avatarUrl } = userInfo;
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
              //将skey存入storage
              try {
                wx.setStorageSync('skey',result.result.skey);
                //获取用户信息
                that.getUserInfo();
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
        wx.showToast({
          title: '登录已过期',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  getUserInfo(){
    const that = this;
    const skey = wx.getStorageSync('skey');
      if (skey) {
          //获取用户详细信息
          // 调用云函数
          wx.cloud.callFunction({
              name: 'getDetail_info',
              data: {
                  skey,
              },
              success: result => {
                  console.log(result.result.info);
                  if(result.result.suc){
                      app.globalData.logged = true;
                      that.setData({
                          avatarUrl: result.result.info.avatarUrl,
                          userInfo: result.result.info,
                          logged: true
                      });
                      app.globalData.userInfo = result.result.info;
                  }else{
                      wx.showToast({
                        title: result.result.info,
                        icon: none,
                        duration: 1000
                      })
                  }
                  that.setData({
                    showLoading: false
                  })
              },
              fail: err => {
                  console.log(err);
              }
          })
      }
  },

  toUserInfo(){
    wx.navigateTo({
      url: '../userInfo/userInfo'
    })
  },

  toGoodsList(e){
    const { page } = e.currentTarget.dataset;
    const { logged } = app.globalData;
    if(logged){
      wx.navigateTo({
        url: `../${page}/${page}`
      })
    }else{
      Dialog.alert({
        title: '未登录',
        message: '您暂未登录，请登录后再进行相关操作'
      });
    }
  },

  onShow: function (options) {
    try {
      const value = wx.getStorageSync('skey')
      if (value) {
        //存在skey，检查session_key是否过期
        console.log('存在skey');
        this.checkLogin();
      }
    } catch (e) {
      console.log(e)
    }
  }
})