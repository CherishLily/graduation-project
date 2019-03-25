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
      'cloud://dev-513b66.6465-dev-513b66/Carousel/1460126225307738.jpg',
      'cloud://dev-513b66.6465-dev-513b66/Carousel/thuibn.jpg'
    ],
    chooseNew: 1
  },

  changeChoice(event) {
    const tag = parseInt(event.currentTarget.dataset.tag, 10);
    this.setData({
      chooseNew: tag
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})