const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {
        goods_list: []

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        const skey = wx.getStorageSync('skey');
        if(skey){
            wx.showLoading({
                title: '加载中'
            })
            wx.cloud.callFunction({
                name: 'getMyPublish_list',
                data: {
                    skey
                },
                success: res => {
                    wx.hideLoading();
                    console.log(res);
                },
                fail: err => {
                    console.log(err);
                }
            })
        }

    }
})