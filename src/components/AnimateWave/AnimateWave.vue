<template>
  <div class="waveWrapper waveAnimation">
    <div class="waveWrapperInner bgTop">
      <span class="wave waveTop"></span>
    </div>
    <div class="waveWrapperInner bgMiddle">
      <span class="wave waveMiddle"></span>
    </div>
    <div class="waveWrapperInner bgBottom">
      <span class="wave waveBottom"></span>
    </div>
  </div>
</template>

<style scoped lang="stylus">
@import '~common/stylus/mixin'
@import '~common/stylus/variable'
@keyframes move_wave
  0%
    transform translateX(0) translateZ(0) scaleY(1)
  50%
    transform translateX(-25%) translateZ(0) scaleY(0.55)
  100%
    transform translateX(-50%) translateZ(0) scaleY(1)
.waveWrapperInner
  position absolute
  width 100%
  overflow hidden
  height 120px
  &.bgTop
    z-index 15
    opacity 0.08
  &.bgMiddle
    z-index 10
    opacity 0.16
  &.bgBottom
    z-index 5
    opacity 0.24
.wave
  position absolute
  left 0
  bottom 0
  width 200%
  height 120px
  background-repeat repeat no-repeat
  background-position 0 bottom
  transform-origin center bottom
  &.waveTop
    background-image url('wave-top.png')
    background-size 50% 100px
  &.waveMiddle
    background-image url('wave-mid.png')
    background-size 50% 120px
  &.waveBottom
    background-image url('wave-bot.png')
    background-size 50% 100px
.waveAnimation
  .waveTop
    animation move-wave 3s
    animation-delay 1s
  .waveMiddle
    animation move_wave 10s linear infinite
  .waveBottom
    animation move_wave 15s linear infinite
</style>
