<script setup>
import * as PIXI from 'pixi.js'
import { ref, defineProps, onMounted } from 'vue'
import { onTick, useApplication } from 'vue3-pixi'
import gsap from 'gsap'

const props = defineProps(['x', 'y', 'width', 'text', 'fontSize', 'fontWeight', 'align'])
const style = ref({
  fontSize: props.fontSize || 28,
  fontFamily: 'Noto Serif JP',
  fontWeight: props.fontWeight || 600,
  fill: '#ff007b',
  breakWords: !!props.width,
  wordWrap: !!props.width,
  wordWrapWidth: props.width,
  align: props.align || 'left',
  lineHeight: props.fontSize,
})

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

// 計算可視範圍，判斷要不要 visible 節省 render 資源
const visible = ref(false)
const renderer = useApplication().value.renderer
const canvasW = renderer.width
const canvasH = renderer.height
const textIns = ref(null)

onTick(() => {
  const screenW = window.innerWidth
  const screenH = window.innerHeight
  const scale = Math.max(screenW / canvasW, screenH / canvasH)

  // 實際顯示的大小
  const displayW = canvasW * scale
  const displayH = canvasH * scale

  // 被裁掉的上下左右
  const offsetX = (displayW - screenW) / 2
  const offsetY = (displayH - screenH) / 2

  const bounds = textIns.value.getBounds()
  const isVisible =
    bounds.x + bounds.width > offsetX / scale &&
    bounds.x < canvasW - offsetX / scale &&
    bounds.y + bounds.height > offsetY / scale &&
    bounds.y < canvasH - offsetY / scale

  visible.value = isVisible
})

onMounted(() => {
  setTimeout(showText, getRdnTime({ init: true }))
})

function handleClick() {
  const tl = gsap.timeline()
  const xDiff = textIns.value.getBounds().width / 2 * 0.05
  const yDiff = textIns.value.getBounds().height / 2 * 0.05

  tl.to(textIns.value, {
    pixi: { colorize: '#ffffff', scale: 1.05 },
    x: props.x - xDiff,
    y: props.y - 16 - yDiff,
    duration: 1,
  }).to(textIns.value, {
    pixi: { colorize: null, scale: 1 },
    x: props.x,
    y: props.y - 16,
    duration: 12,
  })
}
</script>

<template>
  <Text
    ref="textIns"
    interactive
    buttonMode
    :x="props.x"
    :y="props.y - 16"
    :text="text"
    :style="style"
    :visible="visible"
    eventMode="static"
    @click="handleClick" />
</template>
