<template>
  <jf-card title="基本面分析">
    <div class="stk-fundament">
      <template v-if="fundament">
        <p v-html="fundament"></p>
      </template>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">

const DATA_KEY = ['D0124', 'D0125', 'D0128', 'D0131', 'D0138', 'D0142', 'D0153']

export default {
  name: 'StkFundament',
  props: {
    obj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      fundament: ''
    }
  },
  methods: {
    updateInfo() {
      const temp = DATA_KEY.map(key => {
        return this.obj[key]
      })

      // 数值-名称
      const { name = '', num = '' } = this.info
      if (!name || !num) return false

      const text = `${name}（${num}）`

      this.fundament = text + temp.join('<br />')
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
