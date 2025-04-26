<script setup>
import { ref, onMounted, useSlots } from 'vue'

const content = []
const slots = useSlots()
slots.default().forEach(item => {
  if (item.type === 'br') {
    content.push('<br>')
  } else {
    content.push(...item.children.split(''))
  }
})

function getRdnTime({ init = false, pause = false } = {}) {
  return Math.floor(Math.random() * (pause ? 5000 : init ? 6000 : 200)) + (pause ? 5000 : 0);
}

const html = ref('')
const curIdx = ref(0)

function showText() {
  if (curIdx.value === 0) {
    html.value = ''
  } else {
    html.value = [...content].slice(0, curIdx.value).join('')
  }

  setTimeout(showText, curIdx.value === content.length ? getRdnTime({ pause: true }) : getRdnTime())
  curIdx.value = curIdx.value < content.length ? curIdx.value + 1 : 0
}

onMounted(() => {
  setTimeout(showText, getRdnTime({ init: true }))
  // html.value = content.join('')
})
</script>

<template>
  <div v-html="html" />
</template>
