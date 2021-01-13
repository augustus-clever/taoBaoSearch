// index.js
const wsUtil = require('../../utils/util')

Page({
  data: {
    // 自定义导航栏尺寸
    tabBarSize: {},
    // 列表距离顶部距离
    listTop: 0,
    // 子节点
    childNodes: [],
    // 是否显示清除按钮
    isClearShow: false,
    // 历史搜索列表
    showHistory: true,
    historyResult: [],
    // 是否显示展开按钮
    hasMoreBtn: false,
    // 是否获取焦点
    isFocus: false,
    // 输入框中的值
    inputValue: '',
    // 截止到第6行index
    trueIndex: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.calcCustomTabBarSize()
    this.init()
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    this.getChildNodes()
  },
  // 获取所有子节点信息
  getChildNodes() {
    const self = this
    setTimeout(function () {
      wx.createSelectorQuery().in(self).selectAll('.test-child').boundingClientRect(function (rect) {
        console.log(rect)
        self.setData({
          childNodes: rect
        })
        self.toggleHistoryData()
      }).exec()
    }, 500);
  },
  //计算自定义tabBar各尺寸
  calcCustomTabBarSize() {
    const res = wsUtil.customTabBarSize();
    this.setData({
      tabBarSize: {
        //tabBar距离顶部距离
        top: res.top,
        //tabBar高度
        height: res.height,
        //tabBar宽度
        width: res.width,
        //tabBar左右内边距
        padding: res.padding
      }
    })
  },
  // 获取历史搜索缓存
  init() {
    this.setData({
      historyResult: wsUtil.getStorage('history') || []
    })
  },
  // 删除历史记录缓存
  historyDelAll() {
    const self = this
    wx: wx.showModal({
      content: '确认清除所有最近搜索?',
      success: function (res) {
        if (res.confirm) {
          wx: wx.removeStorage({
            key: 'history',
            success: function (res) {
              self.setData({
                historyResult: []
              })
              wsUtil.setStorage("history", [])
            },
          })
        } else {
          console.log("取消")
        }
      },
    })
  },
  // 获取输入框内容
  handleInput(e) {
    const self = this
    let val = e.detail.value
    if (val === '') {
      self.setData({
        inputValue: val,
        isClearShow: false,
        showHistory: true,
        isClearShow: false,
        historyResult: wsUtil.getStorage('history') || []
      })
      self.getChildNodes()
    } else {
      self.setData({
        showHistory: false,
        isClearShow: true,
        inputValue: val
      })
    }
  },
  // 点击最近搜索 设置源
  setInputValue(e) {
    const self = this
    let val = e.currentTarget.dataset.item
    self.setData({
      inputValue: val
    })
    self.searchContent()
  },
  // 确认搜索
  searchContent() {
    const self = this
    if (self.data.inputValue == '') {
      wx.showToast({
        title: '搜索内容不能为空',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    self.buildHistory(self.data.inputValue)
  },
  // 绑定到历史搜索
  buildHistory() {
    const self = this
    var searchInput = self.data.inputValue
    var searchRecord = wsUtil.getStorage('history') || []
    let arrnum = searchRecord.indexOf(searchInput)
    if (arrnum == -1) {
      searchRecord.unshift(searchInput)
    } else {
      searchRecord.splice(arrnum, 1)
      searchRecord.unshift(searchInput)
    }
    wsUtil.setStorage('history', searchRecord)
    self.setData({
      historyResult: searchRecord
    })
    self.getChildNodes()
  },
  // 搜索超过2行折叠，最长不超过5行，超过5行则去除最早插入的数据
  toggleHistoryData() {
    let idx = 0
    let count = 0
    const self = this
    self.data.trueIndex = 0
    let ifHasMoreBtn = false

    self.data.childNodes.forEach((item, index) => {
      if (item.left === self.data.childNodes[0].left) {
        count++
        if (count < 6) {
          if (count === 3) {
            idx = index - 1
            ifHasMoreBtn = true
          }
        } else if (count === 6) {
          // 第6行的内容
          self.data.trueIndex = index - 1
        }
      }
      console.log('idx:-----：' + idx + ',count:-----：' + count + ',trueIndex:-----：' + self.data.trueIndex)
    })

    let value = []
    // 超过2行
    if (idx > 0) {
      value = self.data.historyResult.slice(0, idx)
    } else {
      value = self.data.historyResult
    }
    self.setData({
      hasMoreBtn: ifHasMoreBtn,
      historyResult: value
    })
  },
  // 展开
  toggleShowMore() {
    let value = wsUtil.getStorage('history') || []
    if (this.data.trueIndex != 0) {
      value = value.slice(0, this.data.trueIndex)
      wsUtil.setStorage('history', value)
    }
    this.setData({
      hasMoreBtn: false,
      historyResult: value
    })
  },
  // 获得焦点
  inputfocus() {
    const self = this
    self.setData({
      isFocus: true,
      isClearShow: self.data.inputValue.length > 0 ? true : false
    })
  },
  // 失去焦点
  inputBlur() {
    const self = this
    self.setData({
      isFocus: false,
      isClearShow: false
    });
  },
  // 清空输入框
  clearInput(e) {
    const self = this
    // 防止当前
    setTimeout(() => {
      self.setData({
        isfocus: true,
        showHistory: true
      }, () => {
        self.setData({
          inputValue: '',
          isClearShow: false
        })
      })
    }, 100)
    if (!self.data.hasMoreBtn) {
      self.getChildNodes()
    }
  }
})
