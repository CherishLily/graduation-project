const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showPopup: false,
        columns: ['失物信息', '招领信息'],
        phone_err: '',
        descrip_err: '',
        title_err: '',
        address_err: '',
        time_err: '',
        params: {
            type: '',
            title: '',
            description: '',
            phone: '',
            type_num: 0,     //0:失物信息  1:招领信息
            pic_url: new Array(),
            address: '',
            f_time: ''
        },
        tempFilePaths: [],
        minDate: new Date(2000, 1, 1).getTime(),
        maxDate: new Date(2030, 12, 31).getTime(),
        currentDate: new Date().getTime(),
        showDatePicker: false,
        f_time: ''
      
    },

    closeDatePicker(){
        this.setData({
            showDatePicker: false
        })
    },
    toShowDatePicker(){
        this.setData({
            showDatePicker: true
        })
    },

    chooseDate(e){
        const changeTime = num => {
            if(num<10){
                num = `0${num}`;
            }
            return num;
        }
        const {params} = this.data;
        const time = new Date(e.detail);
        const y = time.getFullYear();
        let m = time.getMonth()+1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s = time.getSeconds();
        m = changeTime(m);
        d = changeTime(d);
        h = changeTime(h);
        mm = changeTime(mm);
        s = changeTime(s);
        params['f_time'] = `${y}-${m}-${d} ${h}:${mm}:${s}`;
        this.setData({
            currentDate: e.detail,
            showDatePicker: false,
            params
        })
    },

    deletePic(e){
        console.log(e);
        const {index} = e.currentTarget.dataset;
        const {tempFilePaths} = this.data;
        tempFilePaths.splice(index,1);
        this.setData({
            tempFilePaths
        })

    },

    doUpload(filePath) {
        const that = this;
        const arr = filePath.split('/');
        const name = arr[arr.length-1];
         // 上传图片
        // const cloudPath = 'goods-pic/my-image' + filePath.match(/\.[^.]+?$/)[0];
        const cloudPath = 'lost-and-found/' + name;

        wx.cloud.uploadFile({
            cloudPath,
            filePath
        }).then(res => {
            console.log('[上传文件] 成功：', res)
            const { params } = that.data;
            const { pic_url } = params;
            pic_url.push(res.fileID);
            params['pic_url'] = pic_url;
            that.setData({
                params
            });
        }).catch(error => {
            console.error('[上传文件] 失败：', error);
             wx.showToast({
                icon: 'none',
                title: '上传失败',
                duration: 1000
            })
        })

    },


    
    chooseImage: function () {
        const that = this;
    // 选择图片
        wx.chooseImage({
            count: 3,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                const filePath = res.tempFilePaths;
                //将选择的图片上传
                filePath.forEach((path, index) => {
                    that.doUpload(path);
                });
                const {tempFilePaths} = that.data;
                that.setData({
                    tempFilePaths: tempFilePaths.concat(filePath)
                },()=>{
                    console.log(that.data.tempFilePaths)
                })
            },
            fail: e => {
                console.error(e)
            }
        })
    },

    onClosePopup(){
        this.setData({
            showPopup: false
        })
    },

    tapToShow(){
        this.setData({
            showPopup: true
        })
    },

    onConfirm(event){
        const { value, index } = event.detail;
        const { params } = this.data;
        params['type'] = value;
        params['type_num'] = index;
        console.log(event.detail);
        this.setData({
            params,
            showPopup: false
        })
    },

    saveMessage(e){
        console.log(e);
        const {type} = e.currentTarget.dataset;
        const { params } = this.data;
        params[type] = e.detail;
        this.setData({
            params,
            phone_err: '',
            descrip_err: '',
            title_err: '',
            address_err: '',
            time_err: ''
        })
    },

    checkParams(params){
        const { type, title, description, phone, address, f_time } = params;
        let temp = 1;
        //判断手机号格式是否正确
        let valid_rule = /^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/;
        if (phone === '') {
            this.setData({
                phone_err: '请输入手机号'
            })
            temp = 0;
        } else if ( ! valid_rule.test(phone)) {
            this.setData({
                phone_err: '手机号格式错误'
            });
            temp = 0;
        }

        //判断发布类型是否为空
        const msg = '请选择发布类型'
       
        if ( ! type ){
            wx.showToast({
                title: msg,
                icon: 'none',
                duration: 1000
            });
            temp = 0;
        }

        //判断描述是否为空
        if(!description){
            this.setData({
                descrip_err: '请填写描述信息'
            });
            temp = 0;
        }

        //判断标题是否为空
        if(!title){
            this.setData({
                title_err: '请填写标题'
            });
            temp = 0;
        }

        //判断地址是否为空
        if(!address){
            this.setData({
                address_err: '请填写地址'
            });
            temp = 0;
        }

        //判断时间是否为空
        if(!f_time){
            this.setData({
                time_err: '请填写时间'
            });
            temp = 0;
        }

        return temp;

    },

    toPublish(){
        const { params } = this.data;

        //发布前校验
        const temp = this.checkParams(params);
        if(temp){
            wx.showLoading({
                title: '发布中',
            });
            const { nickName, avatarUrl } = app.globalData.userInfo;
            params.userDetail = {
                nickName,
                avatarUrl
            }
            console.log(params);
            wx.cloud.callFunction({
                name: 'publish_lost',
                data: params,
                success: res => {
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 1000,
                        success: () => {
                            setTimeout(() => {
                                wx.navigateBack();
                            }, 1000)
                        }
                    })
                },
                fail: err => {
                    console.log(err);
                    wx.hideLoading();
                    wx.showToast({
                        title: '发布失败',
                        icon: 'none',
                        duration: 1000,
                        success: () => {
                            setTimeout(() => {
                                wx.navigateBack();
                            }, 1000)
                        }
                    })
                }

            })
        }
    }
})