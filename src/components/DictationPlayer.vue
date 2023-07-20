<script setup>
import {ref, reactive, onMounted, watch, computed, onBeforeUnmount} from "vue";
import {convertFileSrc} from "@tauri-apps/api/tauri";
import {message} from "@tauri-apps/api/dialog";
import {secondsToTime, timeStringToSeconds} from "../utils/timeTools.js";
import {parseSrt} from "../utils/parseSrt.js";

const audioRef = ref()
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
  totalRepeatTimes: 5
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
const currentButton = computed(()=>{
  if(pageData.loaded){
    if(pageData.playing){
      return "暂停"
    }else{
      return "播放"
    }
  } else {
    return "加载中"
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

import {useMessage} from "naive-ui";
const msg = useMessage()
function onLoadedMetaData(e) {
  pageData.loaded = true
  pageData.duration = e.target.duration
  msg.success("音频加载完成")
}
function setPlaybackRate(rate) {
  audioRef.value.playbackRate = rate
}
function togglePlayOrPause(){
  console.log(audioRef.value.paused)
  if(audioRef.value.paused){
    setPlayingState("play")
  }else{
    setPlayingState("pause")
  }
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
  setPlayingState("pause")
  clearTimers()
  if (pageData.initial){
    pageData.initial = false
  } else {
    pageData.currentIndex += 1
    pageData.currentRepeatedTimes = 0
  }
  handlePlaySentence(pageData.currentIndex)
}

function togglePlayingPrevSentence(){
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
  const {startTime, duration} = pageData.subtitles[index]
  audioRef.value.currentTime = startTime
  emit("onRepeatChange", pageData.currentRepeatedTimes, pageData.currentIndex)
  setPlayingState("play")
  currentSentenceTimer.value = setTimeout(handleNextSentence, duration+300)
}

function handleNextSentence() {
  setPlayingState("pause")
  if (pageData.currentRepeatedTimes === pageData.totalRepeatTimes-1) {
    pageData.currentRepeatedTimes = 0
    pageData.currentIndex += 1
  } else {
    pageData.currentRepeatedTimes += 1
  }
  currentInterSentenceTimer.value = setTimeout(handlePlaySentence, pageData.interval * 1000, pageData.currentIndex)
}

async function toggleConfiguration(){
  await message("所有的句子都听写完啦 ~", {
    title: "恭喜！",
    type: "info"
  })
}

function clearTimers() {
  clearTimeout(currentSentenceTimer.value)
  clearTimeout(currentInterSentenceTimer.value)
}
function calculateTotalTime(subtitlesArray, repeatCount, intervalSeconds) {
  const totalTimesInMilliseconds = subtitlesArray.map((subtitle) => {
    const subtitleDuration = subtitle.duration * repeatCount;
    const totalIntervalTime = (repeatCount - 1) * intervalSeconds * 1000;
    return subtitleDuration + totalIntervalTime;
  });

  const totalTimeInMilliseconds = totalTimesInMilliseconds.reduce((acc, time) => acc + time, 0);

  // Convert total time to seconds
  return secondsToTime(totalTimeInMilliseconds / 1000)
}

async function toggleAsync() {
  await emit("onFinish")
  console.log("callback")
}
</script>

<template>
<div class="wrapper">
  <n-card>
    <audio
      ref="audioRef"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetaData"
    ></audio>
    <template #header>
      <n-a>{{props.title}}</n-a>
    </template>
    <template #header-extra>
      <n-text>{{secondsToTime(pageData.duration)}}</n-text>
    </template>
    <n-slider :value="pageData.currentSlider"></n-slider>
    <template #footer>
      <n-space justify="space-between">
        <n-button-group>
          <n-button @click="togglePlayingPrevSentence">上一句</n-button>
          <n-button @click="togglePlayOrPause">{{currentButton}}</n-button>
          <n-button @click="togglePlayingNextSentence">下一句</n-button>
          <n-button @click="setPlaybackRate(0.75)">0.75x</n-button>
          <n-button @click="setPlaybackRate(1)">1.0x</n-button>
        </n-button-group>
        <n-button-group>
          <n-button>{{currentVerboseMode}}</n-button>
          <n-button>A</n-button>
          <n-button>B</n-button>
          <n-button >复位</n-button>
          <n-button>t</n-button>
        </n-button-group>
      </n-space>
    </template>
  </n-card>
  <n-card>
    <n-space vertical justify="center" align="center">
      <n-h4>
        第 {{pageData.currentRepeatedTimes}} / 5 遍
      </n-h4>
      <n-progress
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

</template>

<style scoped lang="scss">
.wrapper{
  display: grid;
  grid-template-columns: 5fr 1fr;
  grid-column-gap: 12px;
}
.info {
  font-size: 30px
}
</style>