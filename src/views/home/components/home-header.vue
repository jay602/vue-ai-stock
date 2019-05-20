<template>
  <!-- <div class="dashboard">
      <dashboard :score="70"
              style="margin:auto"></dashboard>
      <animate-wave class="wave"></animate-wave>
  </div> -->
  <jf-swiper v-if="slides" :swiperSlides="slides" @itemClick="handleItemClick"></jf-swiper>
</template>

<script type="text/ecmascript-6">
import UserAge from '@/utils/ua-parser'
import { getURLParameters } from '@/utils/url'
import { jumpUrl } from '../../../native-app/native-api'

const SLIDES_DATA = [
  {
    picUrl: require('../../../common/images/banner.png'),
    linkUrl: 'https://sns.9fstock.com:9003/sunline/active/2018/mould1/index.html?actId=67'
  }
]

export default {
  name: 'HomeHeader',
  data() {
    return {
      slides: null
    }
  },
  computed: {
    urlObj() {
      return getURLParameters()
    }
  },
  methods: {
    fetchData() {
      this.slides = SLIDES_DATA
    },
    handleItemClick(item) {
      const { linkUrl } = item
      this.handleAppOpen(linkUrl)
    },
    // 判断APP环境 url：外链完整路径
    handleAppOpen(url) {
      const obj = {
        url,
        bottomTab: false, // 是否需要底部导航栏  //仅限于首页
        backHeader: true, // 是否需要后退按钮
        isFresh: false, // 是否下拉可刷新
        elasticBorder: true, // 是否弹性边框        //针对IOS
        isCloseBtn: true, // 是否关闭按钮
        isNeedHeader: true, // 是否需要头部
        isNewPage: true
      }
      // 在APP内屏蔽是否开新窗口参数为Y时打开新窗口
      if (UserAge.isApp() && UserAge.isIOS() && this.urlObj['isnew'] === 'y') {
        jumpUrl(obj)
      } else if (UserAge.isApp() && UserAge.isAndroid() && this.urlObj['isnew'] === 'y') {
        // TODO: android 平台webview问题比较多，需要做相关兼容处理
        if (typeof window.JFNewClient === 'object' && typeof window.JFNewClient.jumpUrl === 'function') {
          console.log('andorid-JFNewClient')
          jumpUrl(obj)
        } else {
          try {
            console.log('andorid-openaccount')
            window.OpenAccount.openAccount(url)
          } catch (e) {
            window.location.href = url
          }
        }
      } else {
        // 如果vue开户项目内
        window.location.href = url
      }
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'

// 仪表盘
.dashboard
  position relative
  overflow hidden
  height 380px
  background linear-gradient(to right, #ff7034, #ff5735 30%, #ff4a41)
  text-align: center
  .wave
    position absolute
    bottom 0px
    left 0
    right 0
</style>
