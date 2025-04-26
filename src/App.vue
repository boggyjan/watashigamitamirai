<script setup>
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import duration from 'dayjs/plugin/duration'

import Typing from './components/Typing.vue'
import { ref, onMounted } from 'vue'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(duration)

const timeDiff = ref({})

function updateTimeDiff() {
  const endDate = dayjs.tz('2025-07-05 04:18:00', 'Asia/Tokyo').tz(dayjs.tz.guess())

  // test time
  // const endDate = dayjs.tz('2025-04-24 09:48:00', 'Asia/Taipei').tz(dayjs.tz.guess())

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

const scale = ref(0)

function resizeCoverDiv() {
  const scaleX = window.innerWidth / 1500
  const scaleY = window.innerHeight / 700
  scale.value = Math.max(scaleX, scaleY)
}

window.addEventListener('resize', resizeCoverDiv)
resizeCoverDiv()

const grid = false;
</script>

<template>
  <div
    class="wrapper"
    :class="{ 'show-grid': grid }"
    :style="`transform: translate(-50%) scale(${scale})`">
    <div
      v-if="grid"
      class="grid">
      <div v-for="i in 1200"></div>
    </div>

    <div
      v-for="i in 2"
      class="text-container"
      :class="`text-container-${i}`">
      <typing class="t1 tr f120">津波<br>襲<br>来</typing>
      <typing class="t2 f120">覚<br>醒</typing>
      <typing class="t3 tr f120">時に、西<br>暦</typing>
      <typing class="t4 tc f120">2<br>0<br>2<br>5<br>年</typing>
      <typing class="t5 f80">7月5日</typing>
      <typing class="t6 tc f40">4<br>時<br>18<br>分</typing>
      <typing class="t7 tc f120">地殻<br>異常</typing>
      <typing class="t8 f80">第六震央より<br>圧力波到達</typing>
      <typing class="t9 f40">避難完了率、23％に低下</typing>

      <typing class="t10">新世紀計画 第零段階開始</typing>
      <typing class="t11">臨界点突破まで残り31秒</typing>
      <typing class="t12 f40">核心臨界点、残り42秒</typing>
      <typing class="t13 f10">地表壊死域、東方へ拡大中</typing>
      <typing class="t14">隕石軌道に変動発生</typing>
      <typing class="t15">深海震源、異常上昇中</typing>
      <typing class="t16">最終警告、発令準備</typing>
      <typing class="t17">非常脱出路、確保不能</typing>
      <typing class="t18 f80">新時代序章</typing>
      <typing class="t19 f40">防衛ライン第七層、崩壊</typing>
      <typing class="t20">カウントD-003 開始</typing>
      <typing class="t21">指揮系統、<br>強制リブート中</typing>
      <typing class="t22 f40">自動迎撃システム<br>起動不能</typing>
      <typing class="t23 tr">戦術衛星<br>全系統応答不能</typing>
      <typing class="t24 tr">地殻圧力指数<br>異常上昇中</typing>
      <typing class="t25 f40">非常信号C-15<br>繰返し発信中</typing>
      <typing class="t26">退避限界時間<br>残り00:42:16</typing>
      <typing class="t27 f40">ミッションコード<br>「VOID」起動準備</typing>

      <typing class="t28 f10">避難指示が発令された地域では、危険な場所から全員避難する必要がある。</typing>
      <typing class="t29 f10">第三次震源連鎖反応により沿岸地域は壊滅的被害が予測されます。</typing>
      <typing class="t30 f10">津波発生まで残された時間は少なく、直ちに高所<br>への避難を開始してください。</typing>
      <typing class="t31 f40">全通信回線が遮断され、地上部隊は作戦行動の継続が不可能となりました。</typing>
      <typing class="t32 f20">人類新世代計画は最終段階に入り、実行判定はAIによって確定されました。</typing>
      <typing class="t33 f20">衝突予測座標に誤差が発生、隕石断片が都市圏を直撃する可能性があります。</typing>
    </div>
  </div>

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
      <div class="t3">
        大災難<br>
        発生した。
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/app.css';
</style>
