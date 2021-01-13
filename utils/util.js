const app = getApp()

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

// 自定义tabBar尺寸计算
const customTabBarSize = () => {
  //获取手机型号操作系统、右上角胶囊尺寸
  const phoneSystem = app.globalData.phoneInfo,
    getCapsule = wx.getMenuButtonBoundingClientRect() ? wx.getMenuButtonBoundingClientRect() : null;
  let top = 0, height = 0, width = 0, padding = 0;
  if (getCapsule == null) {
    //ios上下间距一般为4，android上下间距为6；胶囊两系统统一高度32，宽度87，距屏幕右侧边距为10
    top = phoneSystem.system.includes('iOS') ? phoneSystem.statusBarHeight + 4 : phoneSystem.statusBarHeight + 6,
      height = 32,
      width = phoneSystem.windowWidth - 97,
      padding = 10
  } else {
    top = getCapsule.top, //tabBar距离顶部距离
      height = getCapsule.height, //tabBar高度
      width = getCapsule.left, //tabBar宽度
      padding = phoneSystem.windowWidth - getCapsule.right //tabBar左右内边距
  }
  return { top: top, height: height, width: width, padding: padding, windowWidth: phoneSystem.windowWidth }
}

const getStorage = (key) => {
  try {
    var v = wx.getStorageSync(key);
    return v;
  } catch (e) {
    return [];
  }
}

const setStorage = (key, cont) => {
  wx.setStorage({
    key: key,
    data: cont
  })
}

module.exports = {
  formatTime,
  customTabBarSize: customTabBarSize,
  getStorage: getStorage,
  setStorage: setStorage
}
