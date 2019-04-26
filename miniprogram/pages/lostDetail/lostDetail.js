const app = getApp();
Page({

    /**
    * 页面的初始数据
    */
    data: {
        detail: {}

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        const that = this;
        wx.showLoading({
            title: '加载中'
        })
        console.log(options.id);
        wx.cloud.callFunction({
            name: 'getLostDetail',
            data: {
                id: options.id
            },
            success: res => {
                wx.hideLoading();
                that.setData({
                    detail: res.result.data
                })
                console.log(res);
            },
            fail: err => {
                wx.hideLoading();
                console.log(err)
            }
        })
    },

    makePhoneCall(){
        wx.makePhoneCall({
            phoneNumber: this.data.detail.phone
        })
    }
})