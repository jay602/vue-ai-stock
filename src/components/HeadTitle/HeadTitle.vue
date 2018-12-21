<template>
  <div class="head-title border-bottom-1px">
    <span class="title">{{title}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'HeadTitle',
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
$title-border-left = #f95a29
$title-color = #333333

.head-title
  line-height 84px
  .title
    line-height 1
    font-size 26px
    color $title-color
    font-weight bold
    letter-spacing 1px
    border-left  4px solid $title-border-left
    padding-left 24px
</style>
