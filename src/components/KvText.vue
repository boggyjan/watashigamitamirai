<script setup>
import { ref, defineProps, onMounted } from 'vue'

const props = defineProps(['x', 'y', 'width', 'text', 'fontSize', 'fontWeight', 'align'])
const style = {
  fontSize: props.fontSize || 28,
  fontFamily: 'Noto Serif JP',
  fontWeight: props.fontWeight || 600,
  fill: '#ff007b',
  breakWords: !!props.width,
  wordWrap: !!props.width,
  wordWrapWidth: props.width,
  align: props.align || 'left',
  lineHeight: props.fontSize,
}

const content = props.text.split('')
const text = ref('')
const curIdx = ref(0)

function getRdnTime({ init = false, pause = false } = {}) {
  return Math.floor(Math.random() * (pause ? 5000 : init ? 6000 : 200)) + (pause ? 5000 : 0);
}

function showText() {
  if (curIdx.value === 0) {
    text.value = ''
  } else {
    text.value = [...content].slice(0, curIdx.value).join('')
  }

  setTimeout(showText, curIdx.value === content.length ? getRdnTime({ pause: true }) : getRdnTime())
  curIdx.value = curIdx.value < content.length ? curIdx.value + 1 : 0
}

onMounted(() => {
  setTimeout(showText, getRdnTime({ init: true }))
})
</script>

<template>
  <Text
    :x="props.x"
    :y="props.y - 16"
    :text="text"
    :style="style" />
</template>
