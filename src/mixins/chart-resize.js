
export default {
  methods: {
    // 响应窗口重绘图表 ==> 侦测屏幕宽
    chartResize(el, chart, fn) {
      // 初始赋值默认屏幕宽
      const initialWidth = document.documentElement.clientWidth

      function resize() {
        // 将定时器绑定至对应图表元素中，监听事件前清除，防止累加绑定
        el.timer && clearTimeout(el.timer)
        el.timer = setTimeout(() => {
          // 获取变化后屏幕宽
          const screenWidth = document.documentElement.clientWidth
          // 若屏幕宽变化则执行 由于这里包含各个页面，故需要等全部执行完毕再重新赋值
          if (initialWidth !== screenWidth) {
            el.style = 'width: 100%;'
            chart.clear()
            fn && fn()
          }
        }, 1000)
      }

      window.addEventListener('resize', resize, false)
      this.$once('hook:beforeDestroy', function () {
        chart.destroy()
        window.removeEventListener('resize', resize)
      })
    }
  }
}
