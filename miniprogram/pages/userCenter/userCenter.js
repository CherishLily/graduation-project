const app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		info: {},
		goods_list: [],
		lost_list: []

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		wx.showLoading({
			title: '加载中'
		})
		const { userId } = options;
		const that = this;
		wx.cloud.callFunction({
			name: 'cFuncs',
			data: {
				userId,
				api_name: 'getOthersInfo'
			},
			success: res => {
				wx.hideLoading();
				const info = res.result[0].data[0].detailInfo;
				const goods_list = res.result[1].data;
				const lost_list = res.result[2].data;
				that.setData({
					info,
					goods_list,
					lost_list
				})
				console.log(res);
			},
			fail: err => {
				wx.hideLoading();
				console.log(err);
			}
		})
	},

	tapToDetail(e){
        wx.navigateTo({
            url: `../goodsDetail/goodsDetail?id=${e.currentTarget.dataset.id}&status=1`
        });
	},

	tapToLostDetail(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../lostDetail/lostDetail?id=${id}`
        });
    },
})