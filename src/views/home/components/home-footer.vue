<template>
  <footer class="footer">
    <p>说明：</p>
    <p>1.个股诊断由{{appName}}依据公开数据模型得出，仅供参考，不构成对所设证券价值的认可及买卖建议。</p>
    <p>2.投资者应当自主做出投资决策，自行承担风险，{{appName}}不以任何方式向投资者做出不受损失或者取得最低收益的承诺。</p>
    <p>3.信息版权归{{appName}}所有，未经本公司事先书面认可，任何机构和个人不得以任何形式翻版、复制、引用或转载。否则，本公司将保留随时追究其法律责任的权利。</p>
  </footer>
</template>

<script>
export default {
  name: 'homeFooter',
  props: {
    appName: {
      type: String,
      default: '玖富犇犇'
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable.styl'
@import '~common/stylus/mixin.styl'
.footer
  padding 30px 24px 40px
  text-align justify
  line-height 38px
  font-size 24px
  color #999
</style>
