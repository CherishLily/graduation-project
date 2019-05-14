const app = getApp();
Page({

	/**
	* 页面的初始数据
	*/
	data: {
		goods_list: [],
		loadNum: 0,
		lastData: false

	},

	/**
	* 生命周期函数--监听页面加载
	*/
	onLoad: function (options) {
		
		const skey = wx.getStorageSync('skey');
		if(skey){
			const { loadNum } = this.data;
			this.getGoods_list(loadNum);
		}
	},

	    /**
    *上拉加载
    */
    onReachBottom(){
        const { lastData } = this.data;
        const { loadNum } = this.data;
        if(!lastData){
            this.getGoods_list(loadNum);
        }

    },

    /**
    *下拉刷新
    */
    onPullDownRefresh(){
        this.getGoods_list(0);
    },

	getGoods_list(loadNum){
		wx.showLoading({
            title: '加载中'
        });
		const skey = wx.getStorageSync('skey');
		const that = this;
		wx.cloud.callFunction({
			name: 'getLikeGoods_list',
			data: {
				skey,
				loadNum
			},
			success: res => {
				wx.stopPullDownRefresh(); // 停止下拉刷新
                wx.hideLoading();
				console.log(res);
				let list = res.result;
				let lastData = false;
				if(res.result.length < 10){
					lastData = true;
				}
				if(loadNum){
					const { goods_list } = that.data;
					list = goods_list.concat(list);
				}
				that.setData({
					goods_list: list,
					loadNum: loadNum + 1,
					lastData: lastData
				})
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

	tapToUserInfo(e){
        const { userid } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../userCenter/userCenter?userId=${userid}`
        })
    }
})