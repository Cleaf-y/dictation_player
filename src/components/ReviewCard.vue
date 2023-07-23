<script setup>
import DiffMatchPatch from "diff-match-patch"
import {ref, reactive} from 'vue'

const corrStyle = ["del",  "ori", "ins"]

const props = defineProps({
  original: String,
  entry: String,
  index: Number
})

const dmp = new DiffMatchPatch()
const diff = dmp.diff_main(props.entry, props.original)
dmp.diff_cleanupSemantic(diff)

const emit = defineEmits(['onPlayback'])

function playbackSentence() {
  emit('onPlayback', props.index)
}
</script>

<template>
<n-card :title="`第${props.index}句`">
  <template #header-extra>
    <n-button @click="playbackSentence">听这句</n-button>
  </template>
  <n-space vertical>

    <n-text>原文；</n-text>
    <n-text>{{props.original}}</n-text>
    <n-text>听写；</n-text>
    <n-text>{{props.entry}}</n-text>
    <n-text>校对；</n-text>
    <div class="correction">
      <span v-for="item in diff" :class="corrStyle[item[0]+1]">{{item[1]}}</span>
    </div>
  </n-space>
</n-card>
</template>

<style scoped lang="scss">
.correction{
  font-size: 20px;
  * {
    margin-right: 0.5px;
  }
  .del {
    color: white;
    text-decoration: line-through;
    background-color: brown;
  }
  .ins {
    padding: 0 1px 0 1px;
    color: white;
    background-color: forestgreen;
  }
}
</style>