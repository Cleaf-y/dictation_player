<script setup>
import {computed, nextTick, onBeforeMount, reactive, ref} from "vue";
import {useRoute} from "vue-router";
import {parseSrt} from "../utils/parseSrt.js";
import DictationPlayer from "../components/DictationPlayer.vue";
import {secondsToTime} from "../utils/timeTools.js";

const route = useRoute()
const data = ref("3")
const cur = ref(0)
const pageData = reactive({
  audioSrc: "",
  subtitleFilePath: "",
  title: "",
  currentEntry: "",
  disabled: false,
  total: 0,
  current: 0,
  currentRepTimes: 0,
  currentIndex: 0,
  subtitles: []
})
const totalEntry = reactive([])
const mytable = ref()
const myAudio = ref()
const myInput = ref()
const currentSentencePercentage = computed(()=>{
  //get integer percentage
  return Math.floor(pageData.currentIndex / pageData.subtitles.length * 100)
})

onBeforeMount(async () => {
  const {audio, text, title} = route.query
  pageData.audioSrc = audio
  pageData.subtitleFilePath = text
  pageData.title = title
  pageData.subtitles = await parseSrt(text)
})



function setCurrent(){
  myAudio.value.test()
}

function getETA(){
  let totalSec = 0

}

async function addData(){
  if (pageData.currentEntry === "") {
    return
  }
  totalEntry.push({
    id: totalEntry.length+1,
    content: pageData.currentEntry
  })
  pageData.currentEntry = ""
  await nextTick()
  let temp = document.getElementsByClassName("el-table__row")
  let totalHeight = 0
  for(let index=0;index<temp.length; index++){
    totalHeight += temp[index].scrollHeight
  }
  mytable.value.scrollTo({
    top: totalHeight,
    behavior: "smooth"
  })
  myInput.value.focus()
  myAudio.value.togglePlayingNextSentence()
}
function setInputClear(){
  pageData.currentEntry = ""
}
function handleRepeatChange(rep, currentIndex){
  pageData.currentRepTimes = rep
  pageData.currentIndex = currentIndex
}

async function onAsync(){
  console.log("finish")
  setTimeout(() => {
    console.log("timeout, callback")
  }, 1000)
}
</script>

<template>
    <DictationPlayer
      :audio="pageData.audioSrc"
      :subtitle="pageData.subtitleFilePath"
      :title="pageData.title"
      @onRepeatChange="handleRepeatChange"
      @onFinish="onAsync"
    />
</template>