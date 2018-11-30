import UserAge from '@/utils/ua-parser'
import JsToNative from './message-app'

// 获取用户全量信息
export function getUserInfoAPP(res) {
  JsToNative('getUserInfo', res)
}

// 使用相机接口
export function useSysCamera(res) {
  JsToNative('useSysCamera', res)
}

// 使用相册
export function openAlbumApp(res) {
  JsToNative('openAlbum', res)
}

// 保存图片至本地
export function saveImg(res) {
  JsToNative('saveImg', res)
}

// 打开webview并打开链接
export function jumpUrl(res) {
  JsToNative('jumpUrl', res)
}

// 跳到APP指定页面
export function jumpPage(res) {
  JsToNative('jumpPage', res)
}

// 分享页面
export function shareApp(res) {
  JsToNative('shareApp', res)
}

// 调用系统通讯录
export function getAddressList(res) {
  JsToNative('getAddressList', res)
}

// 关闭浏览器
export function closeWebView(res) {
  JsToNative('closeWebView', res)
}

// 自定义连拍相机接口
export function userTakePhotos(res) {
  JsToNative('userTakePhotos', res)
}

// 打开交易界面
export function openTrade(res) {
  JsToNative('openTrade', res)
}

// 打电话接口
export function userMakePhone(res) {
  if (UserAge.isAndroid() && UserAge.isApp()) {
    JsToNative('userMakePhone', res)
  } else {
    window.open(`tel:${res.phone}`, '_self')
  }
}

// ST身份证识别
export function getSTIDCardModule(res) {
  JsToNative('getSTIDCardModule', res, true)
}

// ST银行卡识别
export function getSTBankCardModule(res) {
  JsToNative('getSTBankCardModule', res, true)
}

// ST活体检测
export function getSTLivenessModule(res) {
  JsToNative('getSTLivenessModule', res, true)
}

// 是否展示分享角标按钮
export function shareAppBtn(res) {
  JsToNative('shareAppBtn', res)
}

// 唤起分享底部导航栏
export function shareAppAction(res) {
  JsToNative('shareAppAction', res)
}

// 获取手机信息
export function getMobileInfo(res) {
  JsToNative('getMobileInfo', res)
}
