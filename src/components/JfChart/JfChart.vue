<template>
  <div class="jf-chart">
    <p :class="['chart-title', border && 'border']">{{title}}</p>
    <template v-if="!this.chartData">
      <div class="chart-tips">
        <p>数据加载中...</p>
      </div>
    </template>
    <template v-else-if="this.chartData && !this.chartData.length">
      <div class="chart-tips">
        <p>暂无数据</p>
      </div>
    </template>
    <template v-else>
      <slot></slot>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'JfChart',
  props: {
    chartData: null,
    title: {
      type: String,
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped lang="stylus">
.jf-chart
  padding 30px 0
  background-color #ffffff
  box-shadow 0px 2px 28px 0px rgba(76, 76, 76, 0.14)
  border-radius 8px
  &+.jf-chart
    margin-top 20px
  .chart-title
    font-size 26px
    color #333
    padding-left 22px
    padding-bottom 22px
    &.border
      border-bottom 2px solid #e5e5e5
  .chart-tips
    height 200px
    line-height 200px
    text-align center
</style>
