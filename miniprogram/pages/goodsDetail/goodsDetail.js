import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp();

Page({

    /**
    * 页面的初始数据
    */
    data: {
        good_imgs: [],
        detail: {},
        isLike: false,
        logged: false,
        goods_id: 0
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        const skey = wx.getStorageSync('skey');
        const that = this;
        this.setData({
            goods_id: options.id
        })
        wx.cloud.callFunction({
            name: 'getGoods_detail',
            data: {
                skey,
                id: options.id
            },
            success: res => {
                console.log(res);
                that.setData({
                    good_imgs: res.result.detail.data.pic_url,
                    detail: res.result.detail.data,
                    isLike: res.result.isLike,
                    logged: app.globalData.logged
                })
            },
            fail: err => {
                console.log(err);
            }
        })
    },

    modifyLikeGoods(){
        const { logged, isLike, goods_id } = this.data;
        if(logged){
            this.setData({
                isLike: !isLike
            });

            const skey = wx.getStorageSync('skey');
            //调用云函数添加/删除喜欢商品
            wx.cloud.callFunction({
                name: 'saveOrDelete_likes',
                data: {
                    goods_id,
                    skey,
                    isLike: !isLike
                },
                success: res => {
                    console.log(res);
                },
                fail: err => {
                    console.log(err);
                }
            })


        }else{
            Dialog.alert({
                title: '未登录',
                message: '您暂未登录，请登录后再进行操作'
            });
        }
    },

    makePhoneCall(){
        wx.makePhoneCall({
            phoneNumber: this.data.detail.phone
        })
    }
})