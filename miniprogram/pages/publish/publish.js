const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  toPublish(e){
    console.log(e.currentTarget.dataset.type);
    const {type} = e.currentTarget.dataset;
    wx.navigateTo({
    	url: `../publish_old/publish_old?pub_type=${type}`
    })

  }
})