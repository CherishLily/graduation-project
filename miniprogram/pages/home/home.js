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
        hot_list: [],
        choose: 1,
        goods_list: [],
        lost_list: [],
        startNum: 0,
        lastData: false,
        lostStart: 0,
        lastLost: false,
        active: 0,
        classify_list: [{
            icon: '../../images/icons/digit.png',
            txt: '数码'
        }, {
            icon: '../../images/icons/book.png',
            txt: '书籍'
        }, {
            icon: '../../images/icons/soccer.png',
            txt: '运动'
        }, {
            icon: '../../images/icons/shirt.png',
            txt: '服饰'
        }],
        searchKey: ''
    },

    saveSearchKey(e){
        this.setData({
            searchKey: e.detail.value
        });
    },

    changeChoice(event) {
        const tag = parseInt(event.currentTarget.dataset.tag, 10);
        this.setData({
            choose: tag
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

    initLostList(startNum){
        const that = this;
        wx.showLoading({
            title: '加载中'
        })
        wx.cloud.callFunction({
            name: 'getLost_list',
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
                    reverseList = that.data.lost_list.concat(reverseList);
                }
                that.setData({
                    lost_list: reverseList,
                    lastLost: isLast
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
        this.initLostList(0);
    },

    /**
    *上拉加载
    */
    onReachBottom(){
        console.log('上拉加载')
        const { startNum, lastData, lostStart, lastLost, choose } = this.data;

        if(choose == 1 && !lastData){
            this.initList(startNum + 1);
        }else if(choose == 0 && !lastLost){
            this.initLostList(lostStart + 1)
        }

    },

    /**
    *下拉刷新
    */
    onPullDownRefresh(){
        const { choose } = this.data;
        if(choose == 1){
            this.initList(0);
        }else{
            this.initLostList(0);
        }
        
    },

    tapToDetail(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../goodsDetail/goodsDetail?id=${id}&status=1`
        });
    },

    tapToLostDetail(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../lostDetail/lostDetail?id=${id}`
        });
    },

    toClassifyList(e){
        const { classify } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../classifyList/classifyList?from=classify&txt=${classify}`
        })
    },

    toSearchList(){
        let { searchKey } = this.data;
        this.setData({
            searchKey: ''
        })
        searchKey = searchKey.replace(/\s*/g, '');
        if(searchKey){
            wx.navigateTo({
                url: `../classifyList/classifyList?from=search&txt=${searchKey}`
            })
        }
    },

    tapToUserInfo(e){
        const { userid } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../userCenter/userCenter?userId=${userid}`
        })
    }
})