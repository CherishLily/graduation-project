import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {
        sale_list: [],
        unsale_list: [],
        active: 0,
        noSale: false,
        noUnsale: false

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        this.getSaleList();
    },

    getSaleList(){
        const skey = wx.getStorageSync('skey');
        const that = this;
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
                    if(res.result.length){
                        that.setData({
                            sale_list: res.result
                        });
                    }else{
                        that.setData({
                            noSale: true
                        });
                    }
                    console.log(res);
                },
                fail: err => {
                    console.log(err);
                }
            });
        }
    },

    getUnsaleList(){
        const skey = wx.getStorageSync('skey');
        const that = this;
        if(skey){
            wx.showLoading({
                title: '加载中'
            })
            wx.cloud.callFunction({
                name: 'getUnsale_list',
                data: {
                    skey
                },
                success: res => {
                    console.log(res);
                    wx.hideLoading();
                    if(res.result.length){
                        that.setData({
                            unsale_list: res.result
                        });
                    }else{
                        that.setData({
                            noUnsale: true
                        });
                    }
                },
                fail: err => {
                    wx.hideLoading();
                    console.log(err);
                }
            })
        }

    },

    onChange(e){
        console.log(e.detail.index)
        if(e.detail.index === 0){
            this.getSaleList();
        }else{
            this.getUnsaleList();
        }

    },

    tapToDetail(e){
        const { id, status } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../goodsDetail/goodsDetail?id=${id}&status=${status}`
        });
    },

    ifPullOff(e){
        const that = this;
        const { gid, index, type, status } = e.currentTarget.dataset;
        const msg = {
            0: '确定将该商品下架吗？',
            1: '确定将该商品删除吗？',
            2: '确定重新发布商品吗？'
        }
        Dialog.confirm({
            title: '提示',
            message: msg[type]
        }).then(() => {
            if (type == 0){
                that.pullOffShelve(gid, index);
            } else if (type ==1){
                that.deleteGoods(gid, index, status);
            } else {
                that.rePublish(gid, index);
            }
            
        });

    },

    deleteGoods(goods_id, index, status){
        wx.showLoading({
            title: '删除中'
        });
        let list;
        const that = this;
        if(status == 1){
            list = this.data.sale_list;
        }else{
            list = this.data.unsale_list;
        }
        list.splice(index,1);
        wx.cloud.callFunction({
            name: 'cFuncs',
            data: {
                goods_id,
                status,
                api_name: 'deleteGoods'
            },
            success: res => {
                wx.hideLoading();
                if(status == 1){
                    that.setData({
                        sale_list: list
                    })
                }else{
                    that.setData({
                        unsale_list: list
                    })
                }
                
                console.log(res)
            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })


    },

    pullOffShelve(goods_id, index){
        wx.showLoading({
            title: '正在下架'
        });
        const { sale_list } = this.data;
        const that = this;
        sale_list.splice(index,1);
        wx.cloud.callFunction({
            name: 'pullOffShelves',
            data: {
                goods_id
            },
            success: res => {
                wx.hideLoading();
                console.log(res);
                that.setData({
                    sale_list
                })

            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })

    },

    rePublish(goods_id, index){
        wx.showLoading({
            title: '发布中'
        });
        console.log(goods_id);
        const { unsale_list } = this.data;
        const that = this;
        unsale_list.splice(index,1);
        wx.cloud.callFunction({
            name: 'rePublish_goods',
            data: {
                goods_id
            },
            success: res => {
                wx.hideLoading();
                console.log(res);
                that.setData({
                    unsale_list
                });
            },
            fail: err => {
                wx.hideLoading();
                console.log(err)
            }
        })




    }
})