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
        this._setData('D')
        break
      case 'middle':
        this._joinWord('D0021', 'D0029', 'D0037')
        this._setData('W')
        break
      case 'long':
        this._joinWord('D0022', 'D0030', 'D0038')
        this._setData('M')
        break
      }
    },
    _formatList(list) {
      list.forEach(item => {
        item.open = parseFloat(item.open)
        item.high = parseFloat(item.high)
        item.low = parseFloat(item.low)
        item.close = parseFloat(item.close)
      })
      return list
    },
    // 转换技术面分析的数据
    _setData(key = 'D') {
      if (!this.techChart.data[key]) return
      const list = this.techChart.data[key].k_line
      this.techChart.list = this._formatList(list)
      // console.log(this.techChart.list)
    },
    // 拼接技术面分析描述
    _joinWord(key1, key2, key3) {
      this.techChart.desc = `${this.words[key1]} 支撑位: ${this.words[key2]}， 阻力位: ${this.words[key3]}`
    },
    _fetchData() {
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
      this._setData()
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
</style>
