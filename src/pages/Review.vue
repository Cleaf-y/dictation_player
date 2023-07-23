<script setup>
import {ref, reactive, onMounted } from 'vue'
import {useRoute} from 'vue-router'
import {useEntriesStore} from "../store/index.js";
import ReviewCard from "../components/ReviewCard.vue";

const entriesStore = useEntriesStore()

const route = useRoute()
const audioRef = ref()

onMounted(()=>{
  audioRef.value.src = route.query.audioSrc
})
const myEntry = ref([...entriesStore.totalEntry])
const subtitles = ref([...entriesStore.subtitles])

const timer = ref()
function playSentence(index){
  audioRef.value.currentTime = subtitles.value[index].startTime
  audioRef.value.play()
  timer.value = setTimeout(()=>{
    audioRef.value.pause()
  },subtitles.value[index].duration+260)
}

function handlePlayback(i){
  playSentence(i-1)
}

function getEntry(index) {
  let t = myEntry.value.findIndex(obj => obj.id === index+1)
  return t === -1 ? " " : myEntry.value[t].content
}

</script>

<template>
    <audio
      ref="audioRef"></audio>
<n-card :title="`${route.query.title}`">
<n-scrollbar style="max-height: 700px">
  <n-space vertical>
    <ReviewCard v-for="(item, index) in subtitles"
        :original="item.text"
        :entry="getEntry(index)"
        :index="index+1"
                @onPlayback="handlePlayback"
    />
  </n-space>
</n-scrollbar>
</n-card>
</template>