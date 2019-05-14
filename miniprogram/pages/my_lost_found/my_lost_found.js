import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';

const app = getApp();
Page({

    /**
    * 页面的初始数据
    */
    data: {
        lost_list: [],
        found_list: [],
        active: 0

    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中'
        });
        const skey = wx.getStorageSync('skey');
        const that = this;
        wx.cloud.callFunction({
            name: 'getMyLost_found',
            data: {
                skey
            },
            success: res => {
                wx.hideLoading();
                console.log(res);
                const lost_list = res.result.lost.concat(res.result.g_lost);
                const found_list = res.result.found.concat(res.result.r_found);
                that.setData({
                    lost_list,
                    found_list
                });
            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })

    },

    showDialog(e){
        const { gid, index, type, list } = e.currentTarget.dataset;
        const that = this;
        const msg = {
            0: '确定您已找回该物品吗？',
            1: '确定您已找到失主并将物品返还吗？',
            2: '确定删除该条记录吗？'
        }
        Dialog.confirm({
            title: '提示',
            message: msg[type]
        }).then(() => {
            if(type == 2){
                that.deleteRecord(gid, index, list);
            }else{
                that.findOrReturn(gid, index, type, list);
            }
            
        });
    },

    deleteRecord(id, index, list){
        wx.showLoading({
            title: '删除中'
        });
        const that = this;
        const newList = this.data[list];
        const item = newList.splice(index, 1);
        wx.cloud.callFunction({
            name: 'cFuncs',
            data: {
                id,
                api_name: 'deleteLost_found'
            },
            success: res => {
                wx.hideLoading();
                console.log(res);
                if(list === 'lost_list'){
                    that.setData({
                        lost_list: newList
                    });
                }else{
                    that.setData({
                        found_list: newList
                    })
                }
                
            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })
    },

    findOrReturn(id, index, type, list){
        wx.showLoading({
            title: '加载中'
        });
        const that = this;
        const newList = this.data[list];
        const item = newList.splice(index, 1);
        item[0].status = 1;
        newList.push(item[0]);
        console.log(newList);
        wx.cloud.callFunction({
            name: 'cFuncs',
            data: {
                id,
                api_name: 'changeLost_status'
            },
            success: res => {
                wx.hideLoading();
                console.log(res);
                if(type == 0){
                    that.setData({
                        lost_list: newList
                    });
                }else{
                    that.setData({
                        found_list: newList
                    })
                }
            },
            fail: err => {
                wx.hideLoading();
                console.log(err);
            }
        })

    },

    tapToLostDetail(e){
        const { id } = e.currentTarget.dataset;
        wx.navigateTo({
            url: `../lostDetail/lostDetail?id=${id}`
        });
    }
})