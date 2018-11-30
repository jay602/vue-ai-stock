<template>
  <jf-card title="技术面信号">
    <div class="stk-signal">
      <p>{{advantage}}</p>
      <p>{{disadvantage}}</p>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'StkSignal',
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
      advantage: '', // 优势
      disadvantage: '' // 劣势
    }
  },
  methods: {
    updateInfo() {
      const { D0024, D0025 } = this.obj

      this.advantage = D0024
      this.disadvantage = D0025
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
