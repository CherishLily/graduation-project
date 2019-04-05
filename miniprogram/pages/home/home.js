const app = getApp()

Page({

    /**
    * 页面的初始数据
    */
    data: {
        imgUrls: [
            'cloud://dev-513b66.6465-dev-513b66/Carousel/air.jpg',
            'cloud://dev-513b66.6465-dev-513b66/Carousel/damen.jpg',
            'cloud://dev-513b66.6465-dev-513b66/Carousel/timg.jpg',
            'cloud://dev-513b66.6465-dev-513b66/Carousel/yishu.jpg'
        ],
        chooseNew: 1,
        goods_list: [],
        startNum: 0,
        lastData: false
    },

    changeChoice(event) {
        const tag = parseInt(event.currentTarget.dataset.tag, 10);
        this.setData({
            chooseNew: tag
        });
    },

    initList(startNum){
        const that = this;
        wx.showLoading({
            title: '加载中'
        })
        wx.cloud.callFunction({
            name: 'getGoods_list',
            data: {
                startNum
            },
            success: res => {
                console.log(res);
                wx.stopPullDownRefresh(); // 停止下拉刷新
                wx.hideLoading();
                const { isLast } = res.result;
                let reverseList = res.result.list.data.reverse();
                if(startNum){
                    //startNum不为0时，拼接到goods_list的后面
                    reverseList = that.data.goods_list.concat(reverseList);
                }
                that.setData({
                    goods_list: reverseList,
                    lastData: isLast
                });
            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })
    },

    /**
    * 生命周期函数--监听页面显示
    */
    onShow() {
        this.initList(0);
    },

    /**
    *上拉加载
    */
    onReachBottom(){
        console.log('上拉加载')
        const { startNum, lastData } = this.data;
        if(!lastData){
            this.initList(startNum + 1);
        }

    },

    /**
    *下拉刷新
    */
    onPullDownRefresh(){
        this.initList(0);
    },

    tapToDetail(e){
        wx.navigateTo({
            url: `../goodsDetail/goodsDetail?id=${e.currentTarget.dataset.id}`
        });
    }
})