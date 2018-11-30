<template>
  <jf-card title="相关概念">
    <div class="stk-concept">
      <ul>
        <li v-for="(val, ind) in stk_concept_data"
            :key="ind">
            <template v-if="val">
              <span class="concept-text">{{val}}</span>
            </template>
        </li>
      </ul>
    </div>
  </jf-card>
</template>

<script type="text/ecmascript-6">

const DATA_KEY = ['D0004']

export default {
  name: 'StkConcept',
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
      stk_concept_data: null
    }
  },
  methods: {
    updateInfo() {
      this.stk_concept_data = DATA_KEY.map(key => {
        return this.obj[key]
      })
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
.stk-concept
  ul
    overflow hidden
    li
      float left
      .concept-text
        display block
        padding 12px 15px
        background-color #f5f5f5
      &+li
        margin-left 20px
</style>
