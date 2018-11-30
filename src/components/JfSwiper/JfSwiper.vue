<template>
  <swiper class="jf-swiper" :options="swiperOption" ref="mySwiper">
    <!-- slides -->
    <swiper-slide v-for="(item, index) in swiperSlides" :key="index">
      <a :href="item.linkUrl? item.linkUrl : 'javascript:;'" target="_blank">
        <img :src="item.picUrl">
      </a>
    </swiper-slide>
    <!-- Optional controls -->
    <template v-if="this.swiperSlides.length > 1">
      <div id="dots" class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
    </template>
  </swiper>
</template>

<script>
// require styles
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'JfSwiper',
  props: {
    swiperSlides: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      swiperOption: {
        slidesPerView: 1,
        autoplay: {
          delay: 6000,
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} swiper-pagination-bullet-custom"></span>`
          }
        }
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  methods: {
    handleSwiper() {
      if (this.swiperSlides.length < 2) {
        this.swiper.destroy(false)
      }
    }
  },
  mounted() {
    this.handleSwiper()
  },
  components: {
    swiper,
    swiperSlide
  }
}
</script>

<style lang="stylus">
.jf-swiper
  img
    width 100%
    display block

#dots{
  position absolute
  right 0
  left 0
  bottom 28px
  text-align center
  font-size 0
  .swiper-pagination-bullet-custom {
    width 14px
    height 14px
    margin-right 14px
    display inline-block
    border-radius 50%
    opacity 1
    background-color #fff
  }
  .swiper-pagination-bullet-custom.swiper-pagination-bullet-active {
    width 33px
    border-radius 20px
  }
}
</style>