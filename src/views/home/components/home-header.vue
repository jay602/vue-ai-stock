<template>
  <!-- <div class="dashboard">
      <dashboard :score="70"
              style="margin:auto"></dashboard>
      <animate-wave class="wave"></animate-wave>
  </div> -->
  <jf-swiper v-if="slides" :swiperSlides="slides"></jf-swiper>
</template>

<script type="text/ecmascript-6">

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
  methods: {
    fetchData() {
      this.slides = SLIDES_DATA
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
