import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
const app = getApp()
Page({

    /**
    * 页面的初始数据
    */
    data: {
        avatarUrl: 'cloud://dev-513b66.6465-dev-513b66/avatarUrl/user-unlogin.png',
        detailInfo: {},
        showLoading: false,
        showPopup: false,
        columns: ['男', '女']
    },

    /**
    * 生命周期函数--监听页面加载
    */
    onLoad: function (options) {
        this.setData({
            showLoading:true
        })
        const that = this;
        try {
            const skey = wx.getStorageSync('skey');
            if (skey) {
                //获取用户详细信息
                // 调用云函数
                wx.cloud.callFunction({
                    name: 'getDetail_info',
                    data: {
                        skey,
                    },
                    success: result => {
                        console.log(result.result.info);
                        if(result.result.suc){
                            that.setData({
                                avatarUrl: result.result.info.avatarUrl,
                                detailInfo: result.result.info
                            })
                        }else{
                            console.log(result.result.info);
                        }
                        that.setData({
                            showLoading: false
                        })
                    },
                    fail: err => {
                        console.log(err);
                        that.setData({
                            showLoading: false
                        })
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    },

    changeAvatar(){
        const that = this;
    // 选择图片
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                const filePath = res.tempFilePaths;
                //将选择的图片上传
                console.log(filePath);
                that.doUpload(filePath[0]);
            },
            fail: e => {
                console.error(e)
            }
        })
    },

    doUpload(filePath) {
        wx.showLoading({
            title: '上传中'
        })
        const that = this;
        const arr = filePath.split('/');
        const name = arr[arr.length-1];
         // 上传图片
        const cloudPath = 'avatarUrl/' + name;

        wx.cloud.uploadFile({
            cloudPath,
            filePath
        }).then(res => {
            wx.hideLoading();
            console.log('[上传文件] 成功：', res)
            that.setData({
                avatarUrl: res.fileID
            });
        }).catch(error => {
            wx.hideLoading();
            console.error('[上传文件] 失败：', error);
             wx.showToast({
                icon: 'none',
                title: '上传失败',
                duration: 1000
            })
        })
    },

    changeInfo(e){
        const type = e.currentTarget.dataset.type;
        const newInfo = this.data.detailInfo;
        newInfo[type] = e.detail.value;
        this.setData({
            detailInfo: newInfo
        });

    },
    formSubmit(){
        this.setData({
            showLoading: true
        });
        const that = this;
        const { nickName, gender, autograph, dormitoryArea, phoneNumber, weChat } = this.data.detailInfo;
        const { avatarUrl } = this.data;
        try {
            const skey = wx.getStorageSync('skey');
            if (skey) {
                // 调用云函数
                wx.cloud.callFunction({
                    name: 'modifyInfo',
                    data: {
                        skey,
                        nickName, 
                        gender, 
                        autograph, 
                        dormitoryArea, 
                        phoneNumber, 
                        weChat,
                        avatarUrl
                    },
                    success: result => {
                        app.globalData.userInfo = {
                            nickName,
                            gender,
                            autograph,
                            dormitoryArea,
                            phoneNumber,
                            weChat,
                            avatarUrl
                        };
                        that.setData({
                            showLoading: false
                        })
                        Toast(result.result.msg);
                    },
                    fail: err => {
                        that.setData({
                            showLoading: false
                        })
                        console.log(err);
                    }
                })
            }
        } catch (e) {
            console.log(e);
        }
    },

    onClosePopup(){
        this.setData({
            showPopup: false
        })
    },
    onConfirm(event){
        const { value } = event.detail;
        const newInfo = this.data.detailInfo;
        newInfo['gender'] = value;
        this.setData({
            detailInfo: newInfo,
            showPopup: false
        })
    },
    chooseGender(){
        this.setData({
            showPopup: true
        })
    }

})