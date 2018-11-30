<template>
  <jf-card>
    <template slot="title">
      <template v-if="name">
        <div class="stk-name">{{name}}</div>
      </template>
    </template>
    <div class="stk-desc">
      <p>{{desc}}</p>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">

export default {
  name: 'StkAbstract',
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
      name: '',
      desc: ''
    }
  },
  methods: {
    updateInfo() {
      const { D0018 } = this.obj
      // 名称-数值
      const { name = '', num = '' } = this.info
      if (!name || !num) return false

      this.name = `${name}（${num}）`
      // 总评
      this.desc = D0018
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
.stk-name
  padding-top 40px
  padding-left 26px
  margin-bottom -6px
  font-size 30px
  color #333
</style>
