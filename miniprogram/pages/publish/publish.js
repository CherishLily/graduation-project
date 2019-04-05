import Dialog from '../../miniprogram_npm/vant-weapp/dialog/dialog';
const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {

    },

    toPublish(e){
        const { logged } = app.globalData;
        if(logged){
            const {type} = e.currentTarget.dataset;
            wx.navigateTo({
                url: `../publish_old/publish_old?pub_type=${type}`
            })
        }else{
            Dialog.alert({
                title: '未登录',
                message: '您暂未登录，请登录后再进行发布'
            });
        }
    }
})