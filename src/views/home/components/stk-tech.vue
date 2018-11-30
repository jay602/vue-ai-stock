<template>
  <jf-card title="技术面分析">
    <tab-chart :list="techChart.list"
               :desc="techChart.desc"
               @changeLine="handleChangeType"
               v-if="techChart.list.length"></tab-chart>
  </jf-card>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'StkTech',
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      techChart: { // 技术面类型图表
        data: [], // 数据源
        desc: '', // 描述
        list: [], // 对应数据
        type: '' // K线图类型
      },
      words: null
    }
  },
  methods: {
    // 切换技术面类型
    handleChangeType(type) {
      switch (type) {
      case 'short':
        this._joinWord('D0020', 'D0028', 'D0036')
        this._formatTechData('D')
        break
      case 'middle':
        this._joinWord('D0021', 'D0029', 'D0037')
        this._formatTechData('W')
        break
      case 'long':
        this._joinWord('D0022', 'D0030', 'D0038')
        this._formatTechData('M')
        break
      }
    },
    // 转换技术面分析的数据
    _formatTechData(key = 'D') {
      if (!this.techChart.data[key]) return
      const list = this.techChart.data[key].k_line
      this.techChart.list = list.map(item => {
        return {
          open: parseFloat(item.open),
          high: parseFloat(item.high),
          low: parseFloat(item.low),
          close: parseFloat(item.close),
          time: item.time
        }
      })
    },
    // 拼接技术面分析描述
    _joinWord(key1, key2, key3) {
      this.techChart.desc = `${this.words[key1]} 支撑位: ${this.words[key2]}， 阻力位: ${this.words[key3]}`
    },
    updateInfo() {
      const { sr_data,
        change_signal,
        performance_information,
        resistance,
        stock_evaluation,
        support,
        technical,
        technical_information } = this.obj

      const data = Object.values(
        {
          change_signal,
          performance_information,
          resistance,
          stock_evaluation,
          support,
          technical,
          technical_information
        }).reduce((p, n) => Object.assign({}, p, n))

      this.words = data

      // 技术面分析赋值
      if (!sr_data) return false
      this.techChart.data = sr_data.data
      this._joinWord('D0020', 'D0028', 'D0036')
      this._formatTechData()
    }
  },
  created() {
    this.updateInfo()
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
</style>
