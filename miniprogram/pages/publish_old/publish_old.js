const app = getApp();
Page({

    /**
    * 页面的初始数据
    */
    data: {
        columns: [],
        bookType: ['教科书', '辅导资料', '小说', '文学', '历史', '哲学', '艺术', '散文', '其他'],
        goodsType:['数码', '电器', '校园代步', '运动健身', '服饰', '美妆', '电脑', '数码配件', '其他'],
        showPopup: false,
        params: {
            g_type: '',
            isNew: false,
            title: '',
            description: '',
            price: '',
            pricein: '',
            phone: '',
            pub_type: -1,
            pic_url: new Array()
        },
        tempFilePaths: [],
        phone_err: '',
        price_err: '',
        descrip_err: '',
        title_err: ''
     
    },
    onLoad(option){
        let { pub_type } = option;
        const { goodsType, bookType, params } = this.data;
        pub_type = parseInt(pub_type, 10);
        params['pub_type'] = pub_type;
        console.log(pub_type===1);
        if(pub_type){
            this.setData({
                params,
                columns: bookType
            })
        }else{
            this.setData({
                params,
                columns: goodsType
            })
        }
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
        const { value } = event.detail;
        const { params } = this.data;
        params['g_type'] = value;
        console.log(value);
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
            price_err: '',
            descrip_err: '',
            title_err: ''
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
        const cloudPath = 'goods-pic/' + name;

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

    checkParams(params){
        const { g_type, title, description, price, phone, pub_type } = params;
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

        //判断商品类型是否为空
        let msg = ''
        if(pub_type === 0){
            msg = '请选择商品类型';
        }else if(pub_type === 1){
            msg = '请选择书籍类型';
        }
        if ( ! g_type ){
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

        //判断价格是否为空
        if(!price){
            this.setData({
                price_err: '请填写价格'
            });
            temp = 0;
        }

        return temp;

    },

    timeConvert(time){
        const changeTime = num => {
            if(num<10){
                num = `0${num}`;
            }
            return num;
        }
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
        return `${y}-${m}-${d} ${h}:${mm}:${s}`;
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
            params['pub_time'] = this.timeConvert(new Date());
            console.log(params);

            wx.cloud.callFunction({
                name: 'publish_goods',
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