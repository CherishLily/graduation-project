const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {
        avatarUrl: 'cloud://dev-513b66.6465-dev-513b66/avatarUrl/user-unlogin.png',
        detailInfo: {}
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        const that = this;
        try {
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
                                detailInfo: result.result.info
                            })
                        }else{
                            console.log(result.result.info);
                        }
                    },
                    fail: err => {
                        console.log(err);
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    }

})