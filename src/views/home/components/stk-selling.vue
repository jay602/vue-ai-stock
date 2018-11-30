<template>
  <jf-card title="卖空分析">
    <div class="stk-selling">
      <div class="stk-selling-desc">
        <p>卖空成交比例=卖空成交股数/总成交股数；卖空比例高，一方面放映投资者看跌后市股价，另一方面由于后期需要买入股票平仓，也会刺激股价提升。</p>
      </div>
      <jf-chart title="卖空成交比例"
                :border="true"
                :chart-data="stk_selling_bar_data">
        <div class="chart-line">
          <canvas ref="line" style="width: 100%; height: 240px"></canvas>
          <div class="chart-custom-tips" ref="chartTips"></div>
          <div class="chart-line-crosshairs" ref="chartLineCrosshairs"></div>
        </div>
        <div class="chart-bar">
          <canvas ref="bar" style="width: 100%; height: 150px"></canvas>
          <div class="chart-bar-crosshairs" ref="chartBarCrosshairs"></div>
        </div>
      </jf-chart>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">
import chartConfig from '@/utils/vchart'
import chartResize from '@/mixins/chart-resize'

export default {
  name: 'StkAnalyse',
  data() {
    return {
      stk_selling_bar_data: null,
      stk_selling_line_data: null
    }
  },
  props: {
    assetId: {
      type: String,
      required: true
    }
  },
  mixins: [chartResize],
  methods: {
    // 1.获取数据
    _fetchData() {
      if (!this.assetId) {
        this.stk_selling_bar_data = []
        return false
      }

      const params = { 'assetId': this.assetId }
      // 卖空成交比例
      this.$api.getShortSelling(params)
        .then(res => {
          this.handleConvert(res)
        })
        .catch(() => {
          this.stk_selling_bar_data = []
          console.log('==>获取卖空成交比例失败<==')
        })
    },
    handleConvert(res) {
      const { data } = res
      data.forEach((obj) => {
        // obj.isUp的值是'-1','0','1'分别对应的是'跌','平','涨'，将它们自增1换算成索引使用
        // isCloseUp 收盘相比较开盘
        obj.trend = Number(obj.isUp) + 1
        obj.trendClose = Number(obj.isCloseUp) + 1
      })

      this.stk_selling_bar_data = data

      if (!this.stk_selling_bar_data.length) return false
      // 调用绘制函数
      this.$nextTick(() => {
        this.renderChartBar()
        this.renderChartLine()
      })
    },
    renderChartBar() {
      const el = this.$refs.bar
      const data = this.stk_selling_bar_data
      const chart = chartConfig.renderSellBar({ el, data })
      this.chartResize(el, chart, this.renderChartBar)
    },
    renderChartLine() {
      const el = this.$refs.line
      const { chartTips, chartLineCrosshairs, chartBarCrosshairs } = this.$refs
      const data = this.stk_selling_bar_data
      const chart = chartConfig.renderSellLine({ el, chartTips, chartLineCrosshairs, chartBarCrosshairs, data })
      this.chartResize(el, chart, this.renderChartLine)
    }
  },
  created() {
    this._fetchData()
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.stk-selling
  &-desc
    line-height 40px
    margin-bottom 40px

.chart-bar-crosshairs
  opacity 0
  position absolute
  top -38PX
  bottom 47PX
  border 1PX solid #c6c6c6
  z-index 1
</style>
