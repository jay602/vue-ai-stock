<template>
  <div class="jf-card">
    <template v-if="title">
      <head-title :title="title"></head-title>
    </template>
    <template v-else>
      <slot name="title"></slot>
    </template>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'JfCard',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.jf-card
  background-color #fff
  &+.jf-card
    margin-top 20px
  .card-content
    color #666
    font-size 28px
    padding 30px 26px
    letter-spacing 1px
    line-height 38px
    text-align justify
    word-break break-all
</style>
