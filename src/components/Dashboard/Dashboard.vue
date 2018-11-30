<template>
  <canvas id="canvas"
          width="320"
          height="260"></canvas>
</template>

<script type="text/ecmascript-6">
let credit = 0
let angle = 0
export default {
  props: {
    score: { // 分数范围 60~100
      type: Number,
      required: true,
      default: 80,
      validator: value => value >= 60 && value <= 100
    }
  },
  methods: {
    _canvasInit() {
      if (this.score < 60 || this.score > 100) {
        console.log(new Error('invalid score!'))
        return
      }
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      let cWidth = canvas.width
      let cHeight = canvas.height
      let radius = 120
      let deg0 = Math.PI / 9
      let deg1 = Math.PI * 11 / 36
      let score = this.score

      let dot = new this.CreateDot()
      let dotSpeed = 0.05
      ctx.save()
      ctx.clearRect(0, 0, cWidth, cHeight)
      ctx.translate(cWidth / 2, cHeight / 2)
      ctx.rotate(8 * deg0)

      dot.x = radius * Math.cos(angle)
      dot.y = radius * Math.sin(angle)

      var aim = score * deg1 / 25
      if (angle < aim) {
        angle += dotSpeed
      }
      dot.draw(ctx)

      credit += 1
      ctx.save()
      ctx.rotate(10 * deg0)
      ctx.fillStyle = '#fff'
      ctx.font = '60px Microsoft yahei'
      ctx.textAlign = 'center'
      ctx.textBaseLine = 'top'
      ctx.fillText(credit, 0, 10)
      ctx.restore()

      if (credit !== score) {
        window.requestAnimationFrame(this._canvasInit)
      }

      ctx.save() // 中间刻度层
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 255, 255, .2)'
      ctx.lineWidth = 15
      ctx.arc(0, 0, 120, 0, 11 * deg0, false)
      ctx.stroke()
      ctx.restore()

      ctx.save() // 刻度线

      // 大分刻度线
      for (var i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.strokeStyle = 'rgba(255, 255, 255, .3)'
        ctx.moveTo(100, 0)
        ctx.lineTo(115, 0)
        ctx.stroke()
        ctx.rotate(deg1)
      }
      ctx.restore()

      ctx.save() // 细分刻度线
      for (i = 0; i < 20; i++) {
        if (i % 5 !== 0) {
          ctx.beginPath()
          ctx.lineWidth = 2
          ctx.strokeStyle = 'rgba(255, 255, 255, .1)'
          ctx.moveTo(100, 0)
          ctx.lineTo(115, 0)
          ctx.stroke()
        }
        ctx.rotate(deg1 / 5)
      }
      ctx.restore()

      ctx.save() // 分数

      ctx.rotate(Math.PI / 2)
      for (i = 0; i < 5; i++) {
        ctx.fillStyle = 'rgba(255, 255, 255, .4)'
        ctx.font = '10px Microsoft yahei'
        ctx.textAlign = 'center'
        ctx.fillText(0 + 25 * i, 0, -85)
        ctx.rotate(deg1)
      }
      ctx.restore()

      // 信用阶段及评估时间文字
      ctx.save()
      ctx.rotate(10 * deg0)
      ctx.fillStyle = '#fff'
      ctx.font = '14px Microsoft yahei'
      ctx.textAlign = 'center'
      if (score < 70) {
        ctx.fillText('111，中长期观望', 0, 40)
      } else if (score < 80 && score >= 70) {
        ctx.fillText('222，中长期观望', 0, 40)
      } else if (score < 90 && score >= 80) {
        ctx.fillText('333，中长期观望', 0, 40)
      } else if (score <= 100 && score >= 90) {
        ctx.fillText('444，中长期观望', 0, 40)
      }

      ctx.fillStyle = 'rgba(255, 255, 255, 1)'
      ctx.font = '14px Microsoft yahei'
      ctx.fillText('综合评分', 0, -60)
      ctx.restore()

      // 最外层轨道
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(255, 255, 255, .4)'
      ctx.lineWidth = 3
      ctx.arc(0, 0, radius, 0, 11 * deg0, false)
      ctx.stroke()
      ctx.restore()
    },
    CreateDot() {
      this.x = 0
      this.y = 0
      this.draw = ctx => {
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = 'rgba(255, 255, 255, .7)'
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2, false)
        ctx.fill()
        ctx.restore()
      }
    }
  },
  mounted() {
    this._canvasInit()
  }
}
</script>

<style scoped lang="stylus">
@import '~common/stylus/mixin'
@import '~common/stylus/variable'
</style>
