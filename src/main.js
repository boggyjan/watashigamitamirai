import { createApp } from 'vue'
import App from './App.vue'

import * as PIXI from 'pixi.js'
import { PixiPlugin } from 'gsap/PixiPlugin'
import gsap from 'gsap'

gsap.registerPlugin(PixiPlugin)
PixiPlugin.registerPIXI(PIXI)

createApp(App).mount('#app')
