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

    bindGetUserInfo(e) {
        Dialog.confirm({
            title: '提示',
            message: '点击确定进行登录'
        }).then(() => {
            this.goLogin(e.detail.userInfo);
        });

    },

    goLogin(userInfo) {
        const that = this;
        this.setData({
            showLoading: true
        })
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
                        app.globalData.logged = true;
                        app.globalData.userInfo = result.result.info;
                        that.setData({
                            userInfo: result.result.info,
                            logged: true
                        });
                    } else {
                        wx.showToast({
                            title: result.result.info,
                            icon: 'none',
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

    toUserInfo() {
        wx.navigateTo({
            url: '../userInfo/userInfo'
        })
    },

    toGoodsList(e) {
        const {
            page
        } = e.currentTarget.dataset;
        const {
            logged
        } = app.globalData;
        if (logged) {
            wx.navigateTo({
                url: `../${page}/${page}`
            })
        } else {
            Dialog.alert({
                title: '未登录',
                message: '您暂未登录，请登录后再进行相关操作'
            });
        }
    },

    toMyLostList() {
        const {
            logged
        } = app.globalData;
        if (logged) {
            wx.navigateTo({
                url: '../my_lost_found/my_lost_found'
            })
        } else {
            Dialog.alert({
                title: '未登录',
                message: '您暂未登录，请登录后再进行相关操作'
            });
        }

    },
    onShow() {
        const {
            logged,
            userInfo
        } = app.globalData;
        if (logged) {
            this.setData({
                logged,
                userInfo
            })
        }
    },

    onShareAppMessage(options){
        // 设置菜单中的转发按钮触发转发事件时的转发内容
        const shareObj = {
            title: "成理服务平台", // 默认是小程序的名称(可以写slogan等)
            path: '/pages/home/home', // 默认是当前页面，必须是以‘/’开头的完整路径
            imageUrl: '', //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
            success: res => {
                // 转发成功之后的回调
                if (res.errMsg == 'shareAppMessage:ok') {
                    wx.showToast({
                        title: '转发成功',
                        icon: 'success',
                        duration: 1000
                    })
                }
            }
        };
        
        // 返回shareObj
        return shareObj;
    }
})