<template>
  <jf-card title="资金流向分析">
    <div class="stk-money">
      <template v-if="desc">
        <div class="stk-money-desc">
          <p>{{name}}{{desc}}</p>
        </div>
      </template>

      <jf-chart title="资金成交分布  单位:（万元）"
                :chart-data="stk_money_flow_data">
        <div class="chart-ring">
          <canvas ref="ring" style="width: 100%; height: 200px;"></canvas>
        </div>
        <div class="chart-bar">
          <div v-for="item in stk_money_flow_total"
              :key="item.key"
              class="bar-item">
            <canvas :ref="item.key" style="width: 100%; height: 160px;"></canvas>
            <p>{{item.name}}：<span :style="`color: ${item.color}`">{{item.value}}</span></p>
          </div>
        </div>
      </jf-chart>

     <jf-chart title="资金流向趋势"
               :chart-data="stk_money_trend_data">
        <div class="chart-area">
          <canvas ref="area" style="width: 100%; height: 200px;"></canvas>
        </div>
      </jf-chart>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">
import chartConfig from '@/utils/vchart'
import chartResize from '@/mixins/chart-resize'

const STK_MONEY_FLOW_KEY = [
  { name: '大单-流出', key: 'largeOrderOut', color: '#144d2d' },
  { name: '中单-流出', key: 'midOrderOut', color: '#04a17e' },
  { name: '小单-流出', key: 'smallOrderOut', color: '#63d976' },
  { name: '小单-流入', key: 'smallOrderIn', color: '#fd755e' },
  { name: '中单-流入', key: 'midOrderIn', color: '#d72e3d' },
  { name: '大单-流入', key: 'largeOrderIn', color: '#75020d' }
]

const STK_MONEY_FLOW_TOTAL = {
  totalIn: { name: '流入', key: 'totalIn', color: '#da351a' },
  totalOut: { name: '流出', key: 'totalOut', color: '#04a17e' }
}

export default {
  name: 'StkMoneyFlow',
  props: {
    assetId: {
      type: String,
      required: true
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    const stk_money_flow_total = Object.values(STK_MONEY_FLOW_TOTAL)
    return {
      name: '',
      desc: '',
      stk_money_flow_data: null,
      stk_money_trend_data: null,
      stk_money_flow_total,
      stk_money_trend_total: {
        min: 0,
        max: ''
      }, // 趋势最大值与最小值
      sliceInd: STK_MONEY_FLOW_KEY.length / 2 // 资金分布柱状图 分割位置
    }
  },
  mixins: [chartResize],
  methods: {
    updateInfo() {
      // 名称-数值
      const { name, num } = this.info
      this.name = `${name}（${num}）`
    },
    // 1.获取数据
    _fetchData() {
      if (!this.assetId) {
        this.stk_money_flow_data = []
        this.stk_money_trend_data = []
        return false
      }

      const params = { 'assetId': this.assetId }
      // 资金成交分布
      this.$api.getStkMoneyFlow(params)
        .then(res => {
          this.handleConvertFlow(res)
        })
        .catch(() => {
          this.stk_money_flow_data = []
          console.log('==>获取资金成交分布失败<==')
        })

      // 资金流向趋势
      this.$api.getStkMoneyFlowTrend(params)
        .then(res => {
          this.handleConvertTrend(res)
        })
        .catch(() => {
          this.stk_money_trend_data = []
          console.log('==>获取资金流向趋势失败<==')
        })
    },
    // 3.绘制面积图
    renderChartArea() {
      const el = this.$refs.area
      const data = this.stk_money_trend_data
      const { min, max } = this.stk_money_trend_total
      // 港股开关盘时间段
      const charge = ['09:30-12:00', '13:00-16:00']
      const chart = chartConfig.renderMoneyArea({ el, data, charge, min, max })
      this.chartResize(el, chart, this.renderChartArea)
    },
    // 4.绘制环形图
    renderChartRing() {
      const el = this.$refs.ring
      const data = this.stk_money_flow_data
      const colors = data.map(item => item.color)
      const chart = chartConfig.renderMoneyRing({ el, data, colors })
      this.chartResize(el, chart, this.renderChartRing)
    },
    // 5.绘制纵向柱状图 - 流入
    renderChartBarX_totalIn() {
      const el = this.$refs.totalIn[0]
      const data = this.stk_money_flow_data.map(item => {
        const temp = item.name.split('-')[0]
        return { ...item, name: temp }
      }).slice(this.sliceInd).reverse()
      const colors = data.map(item => item.color)
      const textColor = STK_MONEY_FLOW_TOTAL.totalIn.color
      const chart = chartConfig.renderMoneyBar({ el, data, colors, textColor })
      this.chartResize(el, chart, this.renderChartBarX_totalIn)
    },
    // 6.绘制纵向柱状图 - 流出
    renderChartBarX_totalOut() {
      const el = this.$refs.totalOut[0]
      const data = this.stk_money_flow_data.map(item => {
        const temp = item.name.split('-')[0]
        return { ...item, name: temp }
      }).slice(0, this.sliceInd)
      const colors = data.map(item => item.color)
      const textColor = STK_MONEY_FLOW_TOTAL.totalOut.color
      const chart = chartConfig.renderMoneyBar({ el, data, colors, textColor })
      this.chartResize(el, chart, this.renderChartBarX_totalOut)
    },
    // 7.转换资金分布格式
    handleConvertFlow(res) {
      // 这里需要设置空数据，用于暂无数据提示
      if (!res) {
        this.stk_money_flow_data = []
        return false
      }

      // 图表数组
      this.stk_money_flow_data = STK_MONEY_FLOW_KEY.map(item => {
        const value = res[item.key]
        return { ...item, value }
      })

      // 获取 总流入 - 总流出
      this.stk_money_flow_total = Object.values(STK_MONEY_FLOW_TOTAL).map(item => {
        const value = res[item.key]
        return { ...item, value }
      })

      // 概览
      const { totalIn, totalOut } = res
      this.desc = `最近一个交易日内流入 ${totalIn}万元，流出 ${totalOut}万元。`

      // 调用绘制函数
      this.$nextTick(() => {
        this.renderChartRing()
        this.renderChartBarX_totalIn()
        this.renderChartBarX_totalOut()
      })
    },
    // 8.转换资金趋势格式
    handleConvertTrend(res) {
      // 图表数组
      const { data, min, max } = res
      this.stk_money_trend_data = data.map(arr => {
        const name = Number(arr[0])
        const value = Number(arr[1])
        return { name, value }
      })

      // 趋势最小值与最大值
      this.stk_money_trend_total.min = min
      this.stk_money_trend_total.max = max

      if (!this.stk_money_trend_data.length) return false
      // 调用绘制函数
      this.$nextTick(() => {
        this.renderChartArea()
      })
    }
  },
  created() {
    this.updateInfo()
    this._fetchData()
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.stk-money
  &-desc
    line-height 40px
    margin-bottom 40px
  .chart-bar
    width 100%
    overflow hidden
    text-align center
    color #999
    font-size 28px
    .bar-item
      width 50%
      float left
</style>
