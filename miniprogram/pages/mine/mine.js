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

  tapToLogin(){
    Dialog.confirm({
          title: '提示',
          message: '点击确定进行登录'
        }).then(() => {
          // on confirm
          this.goLogin();

        });

  },
  goLogin(){
    const that = this;
    this.setData({
      showLoading: true
    })
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
        // console.log('您未登录或session_key已过期');
        //未登录或登录过期，重新登陆
        Dialog.confirm({
          title: '登录已过期',
          message: '您登录已过期,请点击确定重新登录！'
        }).then(() => {
          // on confirm
          that.goLogin();

        }).catch(() => {
          // on cancel
        });
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
                      that.setData({
                          avatarUrl: result.result.info.avatarUrl,
                          userInfo: result.result.info,
                          logged: true
                      })
                  }else{
                      console.log(result.result.info);
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

  toGoodsList(){
    wx.navigateTo({
      url: '../goodsList/goodsList'
    })
  },
  
  onShow: function (options) {
    try {
      const value = wx.getStorageSync('skey')
      if (value) {
        //存在skey，检查session_key是否过期
        console.log('存在skey');
        this.checkLogin();
      }else{
        console.log('您未登录');
        //没有skey，用户未登录
        Dialog.confirm({
          title: '您未登录',
          message: '您暂未登录,请点击确定去登录！'
        }).then(() => {
          // on confirm
          this.goLogin();

        }).catch(() => {
          // on cancel
        });
      }
    } catch (e) {
      console.log(e)
    }
  }
})