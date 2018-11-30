<template>
  <div class="home">
    <template v-if='!Object.values(stock_data).length && !isError && assetId'>
      <loading />
    </template>
    <template v-else-if="isError">
      <div class="error" @click="handleRequest">点我重试</div>
    </template>
    <template v-else>
      <!-- 头部 -->
      <home-header></home-header>
        <!-- 股票简介 -->
        <stk-abstract :obj="stock_evaluation" :info="stock_info"></stk-abstract>
        <!-- 相关概念 -->
        <stk-concept :obj="stock_concept"></stk-concept>
        <!-- 技术面分析 -->
        <stk-tech :obj="stock_data"></stk-tech>
        <!-- 技术面信号 -->
        <stk-signal :obj="technical_information"></stk-signal>
        <!-- 基本面分析 -->
        <stk-fundament :obj="performance_information" :info="stock_info"></stk-fundament>
        <!-- 资金流向分析 -->
        <stk-money :asset-id="assetId" :info="stock_info"></stk-money>
        <!-- 经纪商分析 -->
        <stk-brokers :asset-id="assetId"></stk-brokers>
        <!-- 卖空分析 -->
        <stk-selling :asset-id="assetId"></stk-selling>

      <!-- 页脚 -->
      <home-footer></home-footer>
    </template>
  </div>
</template>

<script type="text/ecmascript-6">
import { getURLParameters } from '@/utils/url'
import { StkAbstract, StkConcept, StkTech, StkSignal, StkFundament, StkMoney, StkBrokers, StkSelling, HomeHeader, HomeFooter } from './components'

const STK_INFO_KEY = [
  { key: 'D0001', text: 'num' },
  { key: 'D0002', text: 'name' },
  { key: 'code', text: 'code' }
]

export default {
  data() {
    return {
      requestMax: 2, // 限定请求AI数据2次，防止第一次请求数据为空情况
      requestInd: 0, // 默认第一次
      isError: false, // 请求AI数据返回状态
      stock_info: {}, // 股票信息 -- 包含名称，数值，及代码
      stock_data: {},
      stock_concept: {},
      stock_evaluation: {},
      technical_information: {},
      performance_information: {}
    }
  },
  computed: {
    // 获取url地址stock股票code - 并默认添加后缀 HK(港股)
    // 若不包含此参数，则返回空
    assetId() {
      const { stock = '' } = getURLParameters()
      return stock ? `${stock}.HK` : ''
    }
  },
  methods: {
    // 按钮点击重试
    handleRequest() {
      // 限制只触发一次
      this.requestInd = this.requestMax - 1
      this.isError = false
      this._fetchData()
    },
    _fetchData() {
      // 如未含有stock股票代码
      if (!this.assetId) return false

      // 开始参数
      const params = { 'stock': `${this.assetId}.GG` }
      // 请求次数递增
      this.requestInd++
      this.$api.getStockData(params)
        .then(res => {
          const {
            profession,
            stock_evaluation,
            technical_information,
            performance_information
          } = res

          // 获取股票信息
          STK_INFO_KEY.forEach(item => {
            const { key, text } = item
            this.stock_info[text] = profession[key]
          })

          this.stock_data = res
          this.stock_concept = profession
          this.stock_evaluation = stock_evaluation
          this.technical_information = technical_information
          this.performance_information = performance_information
        })
        .catch(() => {
          // 若在允许再次请求次数限制内
          if (this.requestInd < this.requestMax) {
            this._fetchData()
          } else {
            this.isError = true
            console.log('==>获取诊股数据失败<==')
          }
        })
    }
  },
  created() {
    this._fetchData()
  },
  components: {
    StkAbstract,
    StkConcept,
    StkTech,
    StkSignal,
    StkFundament,
    StkMoney,
    StkBrokers,
    StkSelling,
    HomeHeader,
    HomeFooter
  }
}
</script>

<style scoped lang="stylus">
@import './main'
</style>
