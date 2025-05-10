<script setup>
import { ref, onMounted } from 'vue'
import { Application, renderer, onTick } from 'vue3-pixi'
// pixi-filters list https://www.npmjs.com/package/pixi-filters?activeTab=readme
import {
  ShockwaveFilter as ShockwaveFilterBase,
  GlitchFilter as GlitchFilterBase,
  RGBSplitFilter as RGBSplitFilterBase,
} from "pixi-filters";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'
import KvText from '@/components/KvText'
import texts from '@/data/texts'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

const containerPos = ref([null, 0, 1500])

function updateContainerPos() {
  containerPos.value[1] = containerPos.value[1] <= -1500 ? 1500 : containerPos.value[1] - 0.5
  containerPos.value[2] = containerPos.value[2] <= -1500 ? 1500 : containerPos.value[2] - 0.5
}

onTick((delta) => {
  updateContainerPos()
})

// countdown text begin
const timeDiff = ref({})
const pixiWidth = 1500
const pixiHeight = 700

function updateTimeDiff() {
  const endDate = dayjs.tz('2025-07-05 04:18:00', 'Asia/Tokyo').tz(dayjs.tz.guess())

  // test time
  // const endDate = dayjs.tz('2025-05-10 17:36:00', 'Asia/Taipei').tz(dayjs.tz.guess())

  const diffDuration = dayjs.duration(endDate.diff(dayjs()))

  if (diffDuration > 0) {
    diffDuration.$d.totalDays = Math.floor(diffDuration.asDays())
    timeDiff.value = diffDuration.$d
  } else {
    timeDiff.value = null
  }
}

onMounted(() => {
  updateTimeDiff()

  setInterval(() => {
    updateTimeDiff()
  }, 1000)
})

// countdown text end

// ============= Filters =============
function useFilters() {
  const shockwaveFilterConfig = {
    name: 'ShockwaveFilter',
    createElement: (props) => {
      return new ShockwaveFilterBase(
        props.center,
        props.options,
        props.time
      )
    }
  }
  renderer.use(shockwaveFilterConfig)

  const GlitchFilterConfig = {
    name: 'GlitchFilter',
    createElement: (props) => {
      const filter = new GlitchFilterBase(
        props.options,
      )
      props.options.filterIns = filter
      return filter
    }
  }
  renderer.use(GlitchFilterConfig)

  const RGBSplitFilterConfig = {
    name: 'RGBSplitFilter',
    createElement: (props) => {
      return new RGBSplitFilterBase(
        props.red,
        props.green,
        props.blue,
      )
    }
  }
  renderer.use(RGBSplitFilterConfig)
}

useFilters()

// Noise Filters
const noiseSeed = ref(1)

// Shockwave Effects
const shockwaveCenter = ref([pixiWidth / 2, pixiHeight / 2])
const shockwaveTime = ref(2)
const shockwaveOpts = ref({
  radius: -1,
  amplitude: 30,
  wavelength: 120,
})

function updateShockwaveTime() {
  if (shockwaveTime.value < 2) {
    shockwaveTime.value += 0.01
  }
}

onMounted(() => {
  setInterval(() => {
    if (new Date().getSeconds() % 30 === 0) {
      shockwaveTime.value = -0.5
    }
  }, 900)

  onTick((delta) => {
    updateShockwaveTime()
  })
})

const clickShockwaveCenter = ref([pixiWidth / 2, pixiHeight / 2])
const clickShockwaveTime = ref(2)
const clickShockwaveOpts = ref({
  radius: 500,
  amplitude: 30,
  wavelength: 30,
})
const isClickShockwaveClickable = ref(true)

function updateClickShockwaveTime() {
  if (clickShockwaveTime.value < 1) {
    clickShockwaveTime.value += 0.005
  } else {
    isClickShockwaveClickable.value = true
  }
}

onMounted(() => {
  window.addEventListener('click', event => {
    if (isClickShockwaveClickable.value) {
      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      const imageWidth = 1500;
      const imageHeight = 700;

      // 比例要取「較大」的那個，因為是 cover
      const scale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight);

      // 圖片實際被放大後的尺寸
      const displayedWidth = imageWidth * scale;
      const displayedHeight = imageHeight * scale;

      // 被裁掉的量（上下或左右）
      const offsetX = (displayedWidth - containerWidth) / 2;
      const offsetY = (displayedHeight - containerHeight) / 2;

      // 圖片中真實的位置
      const realX = (event.clientX + offsetX) / scale;
      const realY = (event.clientY + offsetY) / scale;

      isClickShockwaveClickable.value = false
      clickShockwaveCenter.value = [realX, realY]
      clickShockwaveTime.value = 0
    }
  })

  onTick((delta) => {
    updateClickShockwaveTime()
  })
})

// Glitch Effect
const glitchInitOpts = {
  slices: 0,
  offset: 8,
  direction: 0,
  fillMode: 0,
  seed: 0,
  average: false,
  minSize: 8,
  sampleSize: 512,
  red: [0, 0],
  green: [0, 0],
  blue: [0, 0],
  filterIns: null,
}

function glitchEffectLoop() {
  setTimeout(() => {
    glitchInitOpts.filterIns.slices = 200

    setTimeout(() => {
      glitchInitOpts.filterIns.slices = 0
      glitchEffectLoop()
    }, Math.random() * 100)
  }, Math.random() * 4000 + 4000)
}

onMounted(() => {
  glitchEffectLoop()
})

// RGB Split Effect
const rgbSplitOptsRed = [1, 1]
const rgbSplitOptsGreen = [-1, -1]
const rgbSplitOptsBlue = [0, 0]
</script>

<template>
  <div
    v-if="false"
    class="dev-panel">
    {{ clickShockwaveTime }}
    <br>
    <input
      v-model.number="clickShockwaveTime"
      type="range"
      :min="-0.5"
      :max="2"
      :step="0.01" />
  </div>
  <Application
    class="pixi-app"
    :width="pixiWidth"
    :height="pixiHeight"
    :resolution="1">
    <Container>
      <Container
        v-for="i in 2"
        :key="`container_${i}`"
        :x="containerPos[i]">
        <Graphics @render="(g) => {
          g.clear()
          g.beginFill(0x000000, 0.00001)
          g.drawRect(0, 0, 1500, 700)
          g.endFill()
        }" />
        <KvText
          v-for="(item, idx) in texts"
          :key="`text_${idx}`"
          :x="item.x"
          :y="item.y"
          :width="item.width"
          :align="item.align"
          :text="item.text"
          :font-weight="item.fontWeight"
          :font-size="item.fontSize" />
      </Container>
      <!-- filters begin -->
      <BlurFilter
        :blur="1" />
      <ShockwaveFilter
        :center="shockwaveCenter"
        :options="shockwaveOpts"
        :time="shockwaveTime" />
      <ShockwaveFilter
        :center="clickShockwaveCenter"
        :options="clickShockwaveOpts"
        :time="clickShockwaveTime" />
      <GlitchFilter
        :options="glitchInitOpts" />
      <NoiseFilter
        :noise="0.5"
        :seed="noiseSeed" />
      <!-- <RGBSplitFilter
        :red="rgbSplitOptsRed"
        :green="rgbSplitOptsGreen"
        :blue="rgbSplitOptsBlue" /> -->
      <!-- filters end -->
    </Container>
  </Application>

  <div class="countdown-container">
    <div v-if="timeDiff">
      <div class="t1">
        大災難発生まで、あと
      </div>
      <div class="t2">
        <span>{{ timeDiff.totalDays }}</span>日
        <span>{{ timeDiff.hours }}</span>時
        <span>{{ timeDiff.minutes }}</span>分
        <span>{{ timeDiff.seconds }}</span>秒
      </div>
    </div>
    <div v-else>
      <div class="t3">大災難</div>
      <div class="t3">発生した…か？</div>
      <div class="t1 mv-1">…笑えば…いいと思うよ</div>
    </div>
  </div>
</template>

<style>
.pixi-app {
  display: block;
  position: fixed;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}
</style>