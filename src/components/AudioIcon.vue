<script setup>
import { defineProps } from 'vue'

defineProps({
  isPlaying: {
    type: Boolean,
    required: true,
  }
})
</script>

<template>
  <div
    class="audio-icon"
    :class="{ animation: isPlaying }" />
</template>

<style lang="scss" scoped>
.audio-icon {
  position: relative;
  top: -4px;
  margin-left: 4px;
  display: inline-block;
  width: 28px;
  height: 28px;
  vertical-align: middle;
  background-image: url('wave.svg');
  background-position: 0 0;
  background-size: contain;

  &.animation {
    animation: 1s audio-icon-bg-ani infinite linear;
  }
}

@keyframes audio-icon-bg-ani {
  to {
    background-position: -28px 0;
  }
}
</style>