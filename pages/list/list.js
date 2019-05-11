// pages/list/list.js
const fetch = require("../../utils/fetch")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[],
    shop:[],
    pageindex:0,
    pagesize:20,
    hasmore:true
  },
  //封装一个请求数据函数
  loadMore:function() {
    if(!this.data.hasmore) return
    //解构赋值
    let {pageindex,pagesize} = this.data
    const params = {_page: ++pageindex,_limit: pagesize}
    return fetch(`categories/${this.data.category.id}/shops`,params)
    .then(res => {
      const totalCount = parseInt(res.header["X-Total-Count"])
      const hasmore = pageindex * pagesize < totalCount
      const shop = this.data.shop.concat(res.data)
      this.setData({
        shop,
        pageindex,
        hasmore
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)
    fetch(`categories/${options.cat}`).then(res => {
      // wx.setNavigationBarTitle({
      //   title: res.data.name
      // })

      this.setData({
        category:res.data
      })
      wx.setNavigationBarTitle({
        title: res.data.name
      })

      //加载完分类信息之后，加载商铺信息
      //return fetch(`categories/${this.data.category.id}/shops`,{_page:1,_limit:10})
      this.loadMore()
    })
    // .then(res => {
    //   this.setData({
    //     shop:res.data
    //   })
    // })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(this.data.category.name) {
      wx.setNavigationBarTitle({
        title: this.data.category.name
      })
    }
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
    //console.log(123)
    //重新加载
    this.setData({pageindex:0,loadMore:true,shop:[]})
    this.loadMore().then(() => wx.stopPullDownRefresh())
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //在这里加载下一页

    //需要判断是否正在加载，避免多次触发问题
    this.loadMore()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})