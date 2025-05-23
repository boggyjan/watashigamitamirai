<script setup>
import { ref, onMounted } from 'vue'
import KeyVisual from './components/KeyVisual'
import AudioIcon from './components/AudioIcon'
import audioData from './constants/audioData'
import texts from '@/data/texts'

// Audio
const audio = ref()
const audioItem = audioData[Math.floor(audioData.length * Math.random())]
const audioPaused = ref(true)

function handleAudioSwitch() {
  if (audio.value.paused) {
    playAudio()
  } else {
    pauseAudio()
  }
}

function playAudio() {
  audio.value.play()
  audioPaused.value = false
}

function pauseAudio() {
  audio.value.pause()
  audioPaused.value = true
}

function setMediaSession() {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.metadata = new MediaMetadata(audioItem.metadata)

    navigator.mediaSession.setActionHandler('play', () => {
      playAudio();
    })
    navigator.mediaSession.setActionHandler('pause', () => {
      pauseAudio();
    })
  }
}

const webFontLoaded = ref(false)

onMounted(() => {
  setMediaSession()

  document.fonts.ready.then(() => {
    webFontLoaded.value = true
  });
})
</script>

<template>
  <div
    v-if="!webFontLoaded"
    class="loading">
    読み込み中...
  </div>
  <KeyVisual v-else />

  <div
    v-if="webFontLoaded"
    class="audio-switch-btn">
    <div
      class="icon"
      @click="handleAudioSwitch">
      {{ audioItem.metadata.title }} / Sound {{ audioPaused ? 'Off' : 'On' }}
      <AudioIcon :isPlaying="!audioPaused" />
    </div>
  </div>

  <audio
    ref="audio"
    loop
    :src="audioItem.path"
    @pause="pauseAudio" />

  <!-- RGB Split Filter -->
  <svg width="0" height="0">
    <filter id="rgb-split">
      <feOffset in="SourceGraphic" dx="-1" dy="-1" result="layer-one" />
      <feComponentTransfer in="layer-one" result="red">
          <feFuncR type="identity" />
          <feFuncG type="discrete" tableValues="0" />
          <feFuncB type="discrete" tableValues="0" />
      </feComponentTransfer>

      <feOffset in="SourceGraphic" dx="1" dy="1" result="layer-two" />
      <feComponentTransfer in="layer-two" result="cyan">
          <feFuncR type="discrete" tableValues="0" />
          <feFuncG type="identity" />
          <feFuncB type="identity" />
      </feComponentTransfer>

      <feBlend in="red" in2="cyan" mode="screen" result="color-split" />
    </filter>
  </svg>

  <div
    v-if="!webFontLoaded"
    class="font-preload">
    <div
      v-for="(item, i) in texts"
      :key="`font-preload_${i}`"
      :style="`font-weight: ${item.fontWeight}`">
      {{ item.text }}
    </div>
  </div>
</template>

<style lang="scss">
@use '@/assets/app.scss';
</style>
