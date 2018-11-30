<template>
  <section class="tab-chart">
    <div class="tech-chart-tabs">
      <ul class="tabs-box">
        <li class="item"
              :class="{active:tabIndex===index}"
              v-for="(item,index) in techTypes"
              :key="item.type"
              @click="handleChangeChartClick(item.type,index)">{{item.text}}</li>
      </ul>
    </div>
    <p class="desc">{{desc}}</p>
    <section class="chart-wrapper">
      <ul class="tabs border-bottom-1px">
        <li class="item"
            :class="{active:tabIndex===index}"
            v-for="(item,index) in chartTypes"
            :key="item.type"
            @click="handleChangeChartClick(item.type,index)">{{item.text}}</li>
      </ul>
      <section ref='chart'
               style="width:100%;height:200px"></section>
    </section>
  </section>
</template>

<script type="text/ecmascript-6">
import {
  Chart,
  ChartWhiteTheme,
  TimeSeriesDrawer,
  TimeSeriesVolumeDrawer,
  CandleStickDrawer,
  // CandleStickVolumeDrawer,
  createYAxisPlugin,
  // createMAPlugin,
  formateDate
} from '@gitpad/finance-chart'
import { parseLargeNumber } from '@/utils/number'

const riseColor = '#f54343' // 涨颜色
const fallColor = '#1aae52' // 跌颜色

const techTypes = [
  { text: '短线', type: 'short' },
  { text: '中线', type: 'middle' },
  { text: '长线', type: 'long' }
]

const chartTypes = [
  { text: '日线', type: 'day' },
  { text: '周线', type: 'week' },
  { text: '月线', type: 'month' }
]

export default {
  props: {
    isLineChart: { // 是否是折线图
      type: Boolean,
      default: false
    },
    lastPrice: { // 昨收价(折线图时必传)
      type: Number,
      default: -1
    },
    desc: {
      type: String,
      default: ''
    },
    data: { // 个股信息数据源
      type: Object,
      default() {
        return {}
      }
    },
    isBig: {
      type: Boolean,
      default: false
    },
    list: { // chart数据列表
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      techTypes, // 技术面类型
      chartTypes, // K线类型
      tabIndex: 0, // k线选项卡索引
      chart: null, // 图表数据实
      chartNode: null, // chart根节点
      windowWidth: document.body.clientWidth
    }
  },
  computed: {
    // chart公共配置
    commonOption() {
      return {
        selector: this.$refs.chart, // 节点
        theme: ChartWhiteTheme // 主题
      }
    }
  },
  watch: {
    list(v1, v2) {
      this._chartInit(this.list, 2)
    }
  },
  methods: {
    // 切换K图Tab
    handleChangeChartClick(type = 'short', index) {
      this.tabIndex = index
      type = techTypes[this.tabIndex].type
      this.$emit('changeLine', type)
    },
    // k线图配置
    _lineChartOption(data, count) {
      const _this = this
      // 如果是大盘，去掉均线
      if (this.isBig) {
        data.forEach(item => {
          delete item.avg
        })
      }
      // 转换成交量
      const shortenVolume = (v) => {
        const scaleV = v / 1e2
        if (scaleV > 1e4) {
          return `${(scaleV / 1e4).toFixed(2)}万股`
        }
        return `${scaleV.toFixed(2)}股`
      }

      const option = Object.assign({}, this.commonOption, {
        data,
        count,
        lastPrice: this.lastPrice, // 昨收价
        mainDrawer: {
          constructor: TimeSeriesDrawer
        },
        // TODO(勿删):以是否有成交量的条件来判断是否绘制柱状图
        // auxiliaryDrawers: this.data.volume !== 0 ? [ // 成交量
        //   { constructor: TimeSeriesVolumeDrawer }
        // ] : [],
        auxiliaryDrawers: [ // 成交量
          { constructor: TimeSeriesVolumeDrawer }
        ],
        tradeTimes: [
          { open: 90, close: 241 }, // 上午开退市时间
          { open: 300, close: 483 } // 下午开退市时间
        ],
        detailProvider(i) {
          const current = data[i]
          const date = new Date()
          date.setTime(current.time)

          const autoColor = (key) =>
            current[key] > this.lastPrice
              ? riseColor
              : fallColor

          return {
            tables: [
              {
                name: '价格',
                color: autoColor(current.price),
                value: current.price.toFixed(2)
              },
              _this.isBig
                ? {}
                : {
                  name: '均价',
                  color: autoColor(current.avg),
                  value: current.avg
                },
              {
                name: '成交量',
                color: '#7B7E8D',
                value: `${shortenVolume(current.volume)}`
              },
              {
                name: '总成交量',
                color: autoColor(current.amount),
                value: parseLargeNumber(current.amount)
              }
            ]
          }
        }
      })
      return option
    },
    // 蜡烛图配置
    _candleChartOption(data, count) {
      const option = Object.assign({}, this.commonOption, {
        data,
        count: 40,
        mainDrawer: {
          constructor: CandleStickDrawer,
          options: {
            plugins: [
              createYAxisPlugin()
            ]
          }
        },
        detailProvider(i) {
          const current = data[i]
          const date = new Date(current.time.replace(/-/g, '/'))
          const WEEK_DAY_MAP = { 0: '周日', 1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六' }

          const autoColor = (key) => {
            if (i === 0) return riseColor
            return current[key] > data[i - 1].close
              ? riseColor
              : fallColor
          }
          return {
            title: `${formateDate(date, 'yyyy/MM/dd')} ${WEEK_DAY_MAP[date.getDay()]}`,
            tables: [
              {
                name: '收盘',
                color: autoColor('close'),
                value: current.close
              },
              {
                name: '开盘',
                color: autoColor('open'),
                value: current.open
              },
              {
                name: '最高',
                color: autoColor('high'),
                value: current.high
              },
              {
                color: autoColor('low'),
                name: '最低',
                value: current.low
              }
            ]
          }
        }
      })
      return option
    },
    // 初始化Chart
    _chartInit(data, count) {
      this._chartDestroyed()
      const option = this._candleChartOption(data, count)

      this.chart = new Chart(option)
      this.chart.setData(data)
    },
    // 注销图表
    _chartDestroyed() {
      if (this.chart !== null) {
        this.chart.destroy()
      }
    }
  },
  mounted() {
    this._chartInit(this.list, 2)
  },
  destroyed() {
    this._chartDestroyed()
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.chart-wrapper
  position relative
  padding-bottom 30px
  margin-top 30px
  background-color #ffffff
  box-shadow 0px 2px 28px 0px rgba(76, 76, 76, 0.14)
  border-radius 8px
.fix-timeline
  display none
  z-index 9
  left 15px
  right 15px
  height 45px
  line-height 45px
  top 250px
  background #fff
  display flex
  justify-content space-between
  font-size 10px
.tab-chart
  background #fff
  .desc
    text-align justify
    line-height 1.4
    margin-top 30px
  .tech-chart-tabs
    text-align center
    margin 0 auto 30px
  .tabs-box
    text-align center
    display inline-block
    border-left 1PX solid #f5f5f5
    border-top 1PX solid #f5f5f5
    border-bottom 1PX solid #f5f5f5
    .item
      position relative
      z-index 2
      display inline-block
      width 150px
      line-height 60px
      color #666
      font-weight 600
      border-right 1PX solid #f5f5f5
      &.active
        background-color #f95a29
        color #fff
  .tabs
    display flex
    height 72px
    box-sizing border-box
    justify-content space-between
    text-align center
    padding 18px 100px
    .item
      position relative
      flex 0 0 60px
      line-height 32px
      font-size $font-size-small
      padding 2px 10px
      color #ccc
      border 1px solid #ccc
      border-radius 20px
      &.active
        color #375eab
        border-color #375eab
</style>
