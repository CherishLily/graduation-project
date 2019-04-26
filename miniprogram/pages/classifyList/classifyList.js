const app = getApp();
Page({

    /**
    * 页面的初始数据
    */
    data: {
        goods_list: [],
        noData: false

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中'
        })
        const that = this;
        const { from, txt } = options;
        const str = txt.replace(/\s*/g, ''); //去掉字符串中的空格
        if(str){
            wx.cloud.callFunction({
                name: 'getClassifyList',
                data: {
                    value: str,
                    from
                },
                success: res => {
                    wx.hideLoading();
                    if(res.result.length){
                        that.setData({
                            goods_list: res.result
                        })
                    }else{
                        that.setData({
                            noData: true
                        })
                    }
                    
                    console.log(res);
                },
                fail: err => {
                    wx.hideLoading();
                    console.log(err);
                }
            })

        }

    },

    tapToDetail(e){
        wx.navigateTo({
            url: `../goodsDetail/goodsDetail?id=${e.currentTarget.dataset.id}&status=1`
        });
    }
})