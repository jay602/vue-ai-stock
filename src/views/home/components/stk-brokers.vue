<template>
  <jf-card title="经纪商分析">
    <div class="stk-brokers">
      <div class="stk-brokers-desc">
        <p>经纪商持股比例=经纪商持仓股数/已发行股数；持股比例最高的几个经纪商，其持股比例的变化，一定程度能反映机构投资者对后市股价的态度。</p>
      </div>
      <jf-chart title="经纪商持股比例" :border="true" :chart-data="stk_brokers_hold_data">
        <div class="chart-line">
          <canvas ref="line" style="width: 100%; height: 360px"></canvas>
          <div class="chart-custom-tips" ref="chartTips"></div>
          <div class="chart-line-crosshairs" ref="chartLineCrosshairs"></div>
          <ul class="chart-custom-legend">
            <li class="legend-item"
                v-for="(val, ind) in legends"
                :key="ind">
                <div @click="handleChangeLine(val, ind)">
                  <template v-if="val.checked">
                    <span class="item-mark" :style="`border-color: ${val.color}`">
                      <i class="tick" :style="`border-color: ${val.color}`"></i>
                    </span>
                  </template>
                  <template v-else>
                    <span class="item-mark"></span>
                  </template>
                  <span class="item-text">{{brokers[ind].brokerName}}</span>
                </div>
            </li>
          </ul>
        </div>
      </jf-chart>
      <jf-chart title="十大净买入/卖出经纪商" :border="true" :chart-data="stk_brokers_net_data">
        <div class="stk-chart-desc">
          <!-- 去除图表示例公式 -->
          <!-- <img class="broker-desc-icon" src="../../../common/images/broker_top_10_desc_icon.png"> -->
          <p>净买入量=当前交易日持股量-上一交易日持股量，</p>
          <p>净卖出量=上一交易日持股量-当前交易日持股量。</p>
        </div>
        <div class="tech-tabs">
          <ul class="tab-box">
            <li class="item"
                v-for="(item,index) in stk_brokers_status"
                :key="item.key"
                :class="{active:statusIndex === index}"
                @click="handleNetStatus(item.key, index)">{{item.text}}</li>
          </ul>
        </div>
        <div class="stk-chart-tips">
          <p>更新时间：{{stk_brokers_net_date}}（交易所数据T+2日计算）</p>
          <p>单位：股</p>
        </div>
        <div class="chart-barY">
          <canvas ref="barY" style="width: 100%; height: 380px"></canvas>
        </div>
        <div class="tech-tabs">
          <ul class="tab-box">
            <li class="item"
                v-for="(item,index) in stk_brokers_time"
                :key="item.key"
                :class="{active:timeIndex === index}"
                @click="handleNetTime(item.key, index)">{{item.text}}</li>
          </ul>
        </div>
      </jf-chart>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">
import { uniqueProp } from '@/utils/array'
import chartConfig from '@/utils/vchart'
import chartResize from '@/mixins/chart-resize'

// 十大经纪商 - 颜色
const STK_BROKERS_NET_COLORS = ['#fdcdbe', '#fdcdbe', '#fdcdbe', '#fdbda9', '#fcac94', '#fb9c7f', '#fb8b69', '#fa7b54', '#fa6a3e', '#f95a29']

// 持股比例 - 颜色
const STK_BROKERS_HOLD_COLORS = ['#8391b4', '#fda34b', '#4bbcfd', '#fd794b', '#b2a216', '#913ddf']

const STL_BROLERS_NET_STATUS = [
  { key: '1', text: '净买入' },
  { key: '2', text: '净卖出' }
]

const STL_BROLERS_NET_TIME = [
  { key: 'day', text: '最近一天' },
  { key: 'week', text: '最近一周' },
  { key: 'month', text: '最近一月' },
  { key: 'quarter', text: '最近一季度' }
]

export default {
  name: 'StkAnalyse',
  data() {
    return {
      chartLine: null, // 持股比例绘图对象
      stk_brokers_status: STL_BROLERS_NET_STATUS,
      stk_brokers_time: STL_BROLERS_NET_TIME,
      brokers: null, // 十大经纪商
      legends: [],
      legends_ids: [],
      stk_brokers_hold_res: null, // 接口返回原始持股数据字段
      stk_brokers_hold_data: null, // 持股数据
      stk_brokers_net_data: null, // 买入卖出数据
      stk_brokers_net_date: '', // 买入卖出数据统计日期
      stk_brokers_net_status: '1',
      stk_brokers_net_time: 'day',
      statusIndex: 0,
      timeIndex: 0
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
    // 经纪商持股比例
    _fetchHold() {
      if (!this.assetId) {
        this.stk_brokers_hold_data = []
        return false
      }

      const params = { 'assetId': this.assetId }
      this.$api.getBrokersHoldStock(params)
        .then(res => {
          this.handleConvertHold(res)
        })
        .catch(() => {
          this.stk_brokers_hold_data = []
          console.log('==>获取经纪商持股失败<==')
        })
    },
    handleConvertHold(res) {
      const { data, topFiveBroker } = res
      if (!topFiveBroker.length) {
        this.stk_brokers_hold_data = []
        return false
      }

      this.stk_brokers_hold_res = data

      const brokerKey = 'brokerId'
      this.brokers = uniqueProp(topFiveBroker, brokerKey)

      const arr = []
      this.brokers.forEach((item, index) => {
        const { brokerId } = item
        const color = STK_BROKERS_HOLD_COLORS[index]
        if (brokerId !== 0) {
          // 图表数据
          const temp = data[brokerId].map(val => Object.assign({}, val, item, { color }))
          arr.push(...temp)
        }

        // 图例
        const legend_item = Object.assign({}, { color, checked: true }, item)
        this.legends.push(legend_item)
      })

      this.stk_brokers_hold_data = arr.map((obj) => {
        // obj.isUp的值是'-1','0','1'分别对应的是'跌','平','涨'，将它们自增1换算成索引使用
        // isCloseUp 收盘相比较开盘
        obj.trend = Number(obj.isUp) + 1
        obj.trendClose = Number(obj.isCloseUp) + 1
        return obj
      })

      // 调用绘制函数
      this.$nextTick(() => {
        this.renderChartLine()
      })
    },
    renderChartLine() {
      const el = this.$refs.line
      const { chartTips, chartLineCrosshairs } = this.$refs
      const data = this.stk_brokers_hold_data
      const colors = STK_BROKERS_HOLD_COLORS
      const chart = chartConfig.renderBrokersLine({ el, colors, chartTips, chartLineCrosshairs, data })
      // 绑定绘图对象
      this.chartLine = chart
      this.chartResize(el, chart, this.renderChartLine)
    },
    // 切换数据修改折线视图
    handleChangeLine(item, index) {
      const { brokerId, checked } = item

      // 若为收盘价终止
      if (brokerId === 0) return false

      this.legends[index].checked = !checked

      // 处理选择的子项
      if (checked) {
        this.legends_ids.push(brokerId)
      } else {
        const ind = this.legends_ids.indexOf(brokerId)
        this.legends_ids.splice(ind, 1)
      }

      const hold_data_filter = this.stk_brokers_hold_data.filter(aa => {
        return !this.legends_ids.includes(aa.brokerId)
      })

      const resData = hold_data_filter.length ? hold_data_filter : this.stk_brokers_hold_res[0]
      this.chartLine.changeData(resData)
    },
    // 十大净买入/卖出经纪商
    _fetchNet() {
      if (!this.assetId) {
        this.stk_brokers_net_data = []
        return false
      }

      const params = Object.assign({},
        { 'assetId': this.assetId },
        {
          buyOrSaleStatus: this.stk_brokers_net_status,
          dateInterval: this.stk_brokers_net_time
        }
      )
      this.$api.getNetBuyOrSaleBrokers(params)
        .then(res => {
          this.handleConvertBrokers(res)
        })
        .catch(() => {
          this.stk_brokers_net_data = []
          console.log('==>获取卖入买出失败')
        })
    },
    // 转换十大净买入卖出数据
    handleConvertBrokers(res) {
      const { data, updateDate } = res
      this.stk_brokers_net_date = updateDate
      this.stk_brokers_net_data = data.map(item => {
        return {
          name: item.brokerName,
          value: Math.abs(item.upDownHoldStockSum),
          ratio: `(${item.oldHoldStockRatio}%->${item.newHoldStockRatio}%)`
        }
      }).reverse()

      if (!this.stk_brokers_net_data.length) return false
      // 调用绘制函数
      this.$nextTick(() => {
        this.renderChartBar()
      })
    },

    // 绘制条形图
    renderChartBar() {
      const el = this.$refs.barY
      const data = this.stk_brokers_net_data
      const colors = STK_BROKERS_NET_COLORS
      const isPositive = this.stk_brokers_net_status === '1'
      const chart = chartConfig.renderBrokersBar({ el, colors, data, isPositive })
      this.chartResize(el, chart, this.renderChartBar)
    },
    // 切换买入卖出
    handleNetStatus(status, index) {
      this.stk_brokers_net_status = status
      this.statusIndex = index
      this._fetchNet()
    },
    // 切换时间
    handleNetTime(time, index) {
      this.stk_brokers_net_time = time
      this.timeIndex = index
      this._fetchNet()
    }
  },
  created() {
    this._fetchHold()
    this._fetchNet()
  }
}
</script>

<style lang="stylus">
@import '~common/stylus/mixin'
.stk-chart
  &-desc
    line-height 40px
    margin-bottom 40px
    padding-left 22px
    padding-top 28px

.broker-desc-icon
  width 52%
  display block
  margin-bottom 20px

.chart-line,.chart-bar
  position relative

.chart-line-crosshairs
  opacity 0
  position absolute
  left 0
  right 0
  border 1PX solid #c6c6c6
  z-index 1

.chart-custom-tips
  opacity 0
  position absolute
  width 44%
  padding 10px
  font-size 24px
  line-height 1.4
  background #f0f2f2
  color #7c8296
  z-index 2
  .tips-title
    text-align center
  li
    overflow hidden
    span
      &:first-child
        float left
        width 50%
        no-wrap()
      &:last-child
        overflow hidden
        text-align right
        display block
</style>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.stk-brokers
  &-desc
    line-height 40px
    margin-bottom 40px

.stk-chart
  &-tips
    margin-top 38px
    font-size 20px
    padding 0 20px
    overflow hidden
    color #999
    & > *
      &:first-child
        float left
        width 80%
        no-wrap()
      &:last-child
        text-align right
        overflow hidden

.chart-custom-legend
  overflow hidden
  padding 0 22px
  position relative
  z-index 10
  .legend-item
    float left
    width 32%
    margin-right 2%
    margin-bottom 20px
    font-size 20px
    &:nth-child(3n)
      margin-right 0
  .item-mark
    float left
    width 24px
    height 24px
    margin-right 9px
    border 2px solid #ddd
    position relative
    .tick
      width 6px
      height 10px
      border-right 2px solid #ddd
      border-bottom 2px solid #ddd
      position absolute
      left 50%
      top 40%
      transform translate(-50%, -50%) rotate(45deg)
  .item-text
    no-wrap()
    display block
    line-height 1.4

.tech-tabs
  text-align center
  padding 0 22px
  line-height 1
  font-size 24px
  .tab-box
    overflow hidden
    display inline-block
    border-left 1PX solid #f5f5f5
    border-top 1PX solid #f5f5f5
    border-bottom 1PX solid #f5f5f5
  .item
    float left
    color #666
    width 150px
    height 60px
    line-height 60px
    font-weight 600
    border-right 1PX solid #f5f5f5
    &.active
      background-color #f95a29
      color #fff
</style>
