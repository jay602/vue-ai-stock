<template>
  <div class="cube-popup cube-popup_mask cube-toast">
    <div class="cube-popup-mask"></div>
    <div class="cube-popup-container cube-popup-center">
      <div class="cube-popup-content">
        <div class="cube-loading">
          <span class="cube-loading-spinners">
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
            <i class="cube-loading-spinner"></i>
          </span>
        </div>
        <div class="cube-toast-tip">{{content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    content: {
      type: String,
      default: 'Loading...'
    }
  },
  data() {
    return {
    }
  }
}
</script>
