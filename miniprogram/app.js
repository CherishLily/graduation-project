//app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                traceUser: true,
                env: 'dev-513b66'
            })
        }

        this.getAuthorize();

        this.globalData = {
            logged: false
        }
    },

    getAuthorize() {
        const that = this;
        wx.getSetting({
            success(res) {
                if (!res.authSetting['scope.userInfo']) {
                    //未授权
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success() {
                            wx.getUserInfo({
                                success: res => {
                                    that.goLogin(res.userInfo)
                                }
                            })
                            console.log('scope.userInfo');
                        }
                    })
                }else{
                    //已授权
                    const value = wx.getStorageSync('skey')
                    if (value) {
                        //存在skey，检查session_key是否过期
                        console.log('存在skey');
                        that.checkLogin();
                    }else{
                        //不存在skey
                        wx.getUserInfo({
                            success: res => {
                                that.goLogin(res.userInfo)
                            }
                        })

                    }
                }
            }
        })
    },

    checkLogin() {
        const that = this;
        wx.checkSession({
            success(e) {
                //登录未过期
                console.log('您已登录,session_key未过期');
                //获取用户信息
                that.getUserInfo();
            },
            fail() {
                wx.getUserInfo({
                    success: res => {
                        that.goLogin(res.userInfo)
                    }
                })
            }
        })
    },

    getUserInfo() {
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
                    if (result.result.suc) {
                        that.globalData.logged = true;
                        that.globalData.userInfo = result.result.info;
                    } else {
                        wx.showToast({
                            title: result.result.info,
                            icon: 'none',
                            duration: 1000
                        })
                    }
                },
                fail: err => {
                    console.log(err);
                }
            })
        }
    },

    goLogin(userInfo) {
        const that = this;
        console.log('userInfo:', userInfo);
        const {
            nickName,
            gender,
            avatarUrl
        } = userInfo;
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
                            console.log('登录成功,skey:', result);
                            //将skey存入storage
                            try {
                                wx.setStorageSync('skey', result.result.skey);
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
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
})