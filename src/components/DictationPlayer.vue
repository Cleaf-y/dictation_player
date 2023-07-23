<script setup>
import {h, ref, reactive, onMounted, watch, computed, onBeforeUnmount} from "vue";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {AnimalCat24Regular, Play12Filled, Pause16Filled, ArrowReset24Filled} from "@vicons/fluent";
import {SkipPreviousFilled, SkipNextFilled} from "@vicons/material";

import {secondsToTime} from "../utils/timeTools.js";
import {parseSrt} from "../utils/parseSrt.js";
import Entry from '../components/Entry.vue'

const audioRef = ref()
const myEntry = ref()
const props = defineProps({
  audio: String,
  subtitle: String,
  title: String
})
const pageData = reactive({
  initial: true,
  loaded: false,
  playing: false,
  disabled: false,
  auto: true,
  duration: 0,
  currentTime: 0,
  currentSlider: 0,
  interval: 5,
  currentIndex: 0,
  subtitles: [],
  currentRepeatedTimes: 0,
  totalRepeatTimes: 2,
  interrupt: false,
  waitingForNext: false
})
const currentSentenceTimer = ref()
const currentInterSentenceTimer = ref()
const currentVerboseTime = computed(()=>{
  return secondsToTime(pageData.currentTime)
})
const currentVerboseMode = computed(()=>{
  if(pageData.auto){
    return "自动"
  }else{
    return "手动"
  }
})

const emit = defineEmits(["onRepeatChange", "onFinish"])
defineExpose({
  togglePlayingNextSentence
})
function setPlayingState(state){
  switch (state) {
    case "play":
      pageData.playing = true
      audioRef.value.play()
      break;
    case "pause":
      pageData.playing = false
      audioRef.value.pause()
      break;
  }
}

onMounted(async () => {
  audioRef.value.src = convertFileSrc(props.audio)
  pageData.subtitles = await parseSrt(props.subtitle)
})

onBeforeUnmount(()=>{
  clearTimers()
})

function onTimeUpdate(e) {
  pageData.currentTime = e.target.currentTime
  pageData.currentSlider = pageData.currentTime / pageData.duration * 100
}

import {NButton,NSpace, useMessage, useThemeVars} from "naive-ui";
const msg = useMessage()
const themeVars = useThemeVars()
function onLoadedMetaData(e) {
  pageData.loaded = true
  pageData.duration = e.target.duration
  msg.success("音频加载完成")
}
function setPlaybackRate(rate) {
  audioRef.value.playbackRate = rate
}
function togglePlay(){
  if(pageData.playing){
    return
  }
  if(pageData.initial){
    togglePlayingNextSentence()
    return
  }
  if(pageData.waitingForNext){
    handlePlaySentence(pageData.currentIndex)
    return
  }
  clearTimers()
  const {startTime, duration} = pageData.subtitles[pageData.currentIndex]
  let offset = audioRef.value.currentTime - startTime
  setPlayingState("play")
  currentSentenceTimer.value = setTimeout(handleNextSentence, duration-offset*1000+300)

}
function togglePause(){
    if(pageData.initial){
      msg.warning("还没开始播放哦~")
      return
    }
    pageData.interrupt=true
    setPlayingState("pause")
    clearTimers()
}
function setCurrentTimeBySlider(e){
  if(pageData.auto) return
  audioRef.value.currentTime = e / 100 * pageData.duration
  if (audioRef.value.paused) audioRef.value.play()
}

const formatToolTip = (val)=>{
  if (pageData.auto) return "自动播放中"
  return secondsToTime(val / 100 * pageData.duration)
}

function togglePlayingNextSentence(){
  if (pageData.initial){
    pageData.initial = false
  } else {
    if (pageData.currentIndex === pageData.subtitles.length-1){
      msg.info("已经是最后一句啦 ~ ")
      return
    }
    pageData.currentIndex += 1
    pageData.currentRepeatedTimes = 0
  }
  setPlayingState("pause")
  clearTimers()
  pageData.interrupt=false
  handlePlaySentence(pageData.currentIndex)
}

function togglePlayingPrevSentence(){
  if(pageData.currentIndex === 0){
    msg.info("已经是第一句啦 ~ ")
    return
  }
  pageData.interrupt=false
  setPlayingState("pause")
  clearTimers()
  if (pageData.initial){
    pageData.initial = false
  } else {
    pageData.currentIndex -= 1
    pageData.currentRepeatedTimes = 0
  }
  handlePlaySentence(pageData.currentIndex)
}

function handlePlaySentence(index){
  pageData.waitingForNext = false
  pageData.currentRepeatedTimes += 1
  if(pageData.currentRepeatedTimes===1){
    myEntry.value.pageData.canInput = false
  }
  const {startTime, duration} = pageData.subtitles[index]
  audioRef.value.currentTime = startTime
  emit("onRepeatChange", pageData.currentRepeatedTimes, pageData.currentIndex)
  setPlayingState("play")
  currentSentenceTimer.value = setTimeout(handleNextSentence, duration+300)
}

import {useNotification} from "naive-ui";
const notification = useNotification()
function handleNextSentence() {
  setPlayingState("pause")
  pageData.waitingForNext = true
  if(pageData.currentRepeatedTimes === 1 ){
    myEntry.value.pageData.canInput = true
  }
  if (pageData.currentRepeatedTimes === pageData.totalRepeatTimes) {
    if(pageData.currentIndex === pageData.subtitles.length-1){
      msg.success("所有的句子都听写完啦 ~")
      notification.info({
        title: "恭喜！",
        content: "所有的句子都听写完啦 ~",
        closable: false,
        action: () =>
            h(
                NSpace,
                {
                  justify: "end",
                  align: "end"
                },
                {
                  default: () =>
                      h(
                          NButton,
                          {
                            text: true,
                            type: "primary",
                            onClick: () => {}
                          },
                          {
                            default: () => "去校对"
                          }
                      )
                }
            )
      })


      clearTimers()
      emit("onFinish")
      return
    }
    pageData.currentRepeatedTimes = 0
    pageData.currentIndex += 1
  }
  currentInterSentenceTimer.value = setTimeout(handlePlaySentence, pageData.interval * 1000, pageData.currentIndex)
}

function clearTimers() {
  clearTimeout(currentSentenceTimer.value)
  clearTimeout(currentInterSentenceTimer.value)
}
function calculateTotalTime() {
  const totalTimesInMilliseconds = pageData.subtitles.map((subtitle) => {
    const subtitleDuration = subtitle.duration * pageData.totalRepeatTimes;
    const totalIntervalTime = (pageData.totalRepeatTimes - 1) * pageData.interval * 1000;
    return subtitleDuration + totalIntervalTime;
  });

  const totalTimeInMilliseconds = totalTimesInMilliseconds.reduce((acc, time) => acc + time, 0);

  // Convert total time to seconds
  return secondsToTime(totalTimeInMilliseconds / 1000)
}

function toggleClearPlayback() {
  clearTimers()
  setPlayingState('pause')
  pageData.initial = true
  pageData.currentIndex = 0
  pageData.currentRepeatedTimes = 0
  audioRef.value.currentTime = 0
}

function onGoTo(index){
  clearTimers()
  setPlayingState('pause')
  pageData.currentRepeatedTimes = 0
  pageData.currentIndex = index-1
  handlePlaySentence(index-1)
}

const repeatTimesOptions = [
  {
    label: "1次",
    key: "1"
  },
  {
    label: "2次",
    key: "2"
  },
  {
    label: "3次",
    key: "3"
  },
  {
    label: "4次",
    key: "4"
  },
  {
    label: "5次",
    key: "5"
  }
]
function handleSelectTimes(key){
  pageData.totalRepeatTimes = parseInt(key)
}

const intervalOptions = [
  {
    label: "5秒",
    key: "5"
  },
  {
    label: "8秒",
    key: "8"
  },
  {
    label: "10秒",
    key: "10"
  }
]
function handleSelectInterval(key) {
  pageData.interval = parseInt(key)
}
</script>

<template>
<n-space vertical>
  <div class="wrapper">
    <n-card>
      <audio
          ref="audioRef"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onLoadedMetaData"
      ></audio>
      <template #header>
        <n-space>
          <n-a>{{props.title}}</n-a>
          <n-tag>ETA: {{calculateTotalTime()}}</n-tag>
          <n-tag v-show="pageData.interrupt" type="warning">暂停</n-tag>
        </n-space>

      </template>
      <template #header-extra>
        <n-text type="success">{{secondsToTime(pageData.currentTime)}}</n-text>
        <n-text depth="3">/ {{secondsToTime(pageData.duration)}}</n-text>
      </template>
      <n-slider :value="pageData.currentSlider" :format-tooltip="formatToolTip">
        <template #thumb>
          <n-icon-wrapper :size="24" :border-radius="12">
            <n-icon :size="18" :component="AnimalCat24Regular" />
          </n-icon-wrapper>
        </template>
      </n-slider>
      <template #footer>
        <n-space justify="space-between">
          <n-button-group>
            <n-button @click="togglePlayingPrevSentence"><template #icon><n-icon :size="24"><SkipPreviousFilled /></n-icon></template></n-button>
            <n-button @click="togglePlay"><template #icon><Play12Filled /></template></n-button>
            <n-button @click="togglePause"><template #icon><Pause16Filled /></template></n-button>
            <n-button @click="togglePlayingNextSentence"><template #icon><n-icon :size="24"><SkipNextFilled /></n-icon></template></n-button>
            <n-button @click="setPlaybackRate(0.75)">0.75x</n-button>
            <n-button @click="setPlaybackRate(1)">1.0x</n-button>
            <n-button @click="toggleClearPlayback"><template #icon><ArrowReset24Filled /></template></n-button>
          </n-button-group>
          <n-button-group>
            <n-button>{{currentVerboseMode}}</n-button>
            <n-button>A</n-button>
            <n-button>B</n-button>
            <n-button >复位</n-button>
            <n-dropdown trigger="hover" :options="repeatTimesOptions" @select="handleSelectTimes">
              <n-button>{{pageData.totalRepeatTimes}}次</n-button>
            </n-dropdown>
            <n-dropdown trigger="hover" :options="intervalOptions" @select="handleSelectInterval">
              <n-button>{{pageData.interval}}秒</n-button>
            </n-dropdown>
          </n-button-group>
        </n-space>
      </template>
    </n-card>
    <n-card>
      <n-space vertical justify="center" align="center">
        <n-h4 v-if="pageData.currentRepeatedTimes===0">
          等待播放
        </n-h4>
        <n-h4 v-if="pageData.currentRepeatedTimes!==0">
          第 {{pageData.currentRepeatedTimes}} / {{pageData.totalRepeatTimes}} 遍
        </n-h4>
        <n-progress
            :color="themeVars.successColor"
            type="circle"
            :percentage="Math.round(pageData.currentIndex / pageData.subtitles.length * 100)"
        >
          <n-space vertical justify="center" align="center">
            <span class="info">{{pageData.currentIndex+1}}</span>
            <span>共{{pageData.subtitles.length}}句</span>
          </n-space>
        </n-progress>
      </n-space>
    </n-card>
  </div>
  <Entry
      :initial="pageData.initial"
      :total="pageData.subtitles.length"
      ref="myEntry"
      @onToggleNextSentence="togglePlayingNextSentence"
      @onGoToSentence="onGoTo"
  />
</n-space>

</template>

<style scoped lang="scss">
.wrapper{
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-column-gap: 10px;
}
.info {
  font-size: 30px
}

</style>