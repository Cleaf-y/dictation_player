<script setup>
import {ref, reactive, nextTick, onBeforeUnmount, watch, defineExpose} from "vue";
import {useMessage} from "naive-ui";
import Pony1 from "./Pony1.vue";

const msg = useMessage()
const emit = defineEmits(["onToggleNextSentence", "onGoToSentence"])
const pageData = reactive({
  currentEntry: "",
  disabled: false,
  total: 0,
  currentIndex: 0,
  editIndex: 0,
  canInput: false,
  byPass: false
})
const totalEntry = reactive([{id: 1, content: ""}])
const myTable = ref()
const myInput = ref()
const myTableColumns = [
  {
    title: '序号',
    key: 'id',
    width: 30
  },
  {
    title: '听写内容',
    key: 'content',
    width: 500
  }
]
const props = defineProps({
  initial: Boolean,
  total: Number,
  current: Number
})

const holder = computed(()=>{
  if (props.initial) {
    return "等待开始"
  }
  return pageData.canInput ? "": "第一遍播放中..."
})

watch(()=>props.current,async newVal=>{
  console.log('@', newVal)
  pageData.currentIndex = newVal
  let index = totalEntry.findIndex(obj => obj.id === newVal+1)
  console.log(index)
  if (index === -1) {
    pageData.currentEntry=""
    totalEntry.push({
      id: newVal+1,
      content: ""
    })
    pageData.editIndex = totalEntry.length - 1
  } else {
    pageData.editIndex = index
    pageData.currentEntry = totalEntry[index].content
  }
  await nextTick()
  myTable.value.scrollTo({
    top: getTotalHeight(),
    behavior: 'smooth'
  })
  myInput.value.focus()
  pageData.byPass = false
})

function getTotalHeight() {
  let row = document.getElementsByClassName('n-data-table-td')
  let totalHeight = 0
  for(let index=0;index<row.length;index++){
    totalHeight += row[index].scrollHeight
  }
  return totalHeight
}
function addEntry(){
  if(pageData.currentEntry === ""){
    msg.warning("输入为空")
    return
  }
    totalEntry[pageData.editIndex].content = pageData.currentEntry
}

async function onKey() {
  pageData.currentEntry = ""
  await nextTick()
  myTable.value.scrollTo({
    top: getTotalHeight(),
    behavior: 'smooth'
  })
  myInput.value.focus()
  pageData.byPass = false
  emit('onToggleNextSentence')
}
function onStage(){

}

const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      msg.info(`切换到第${row.id}句`);
      emit('onGoToSentence', parseInt(row.id))
      pageData.currentEntry = row.content
      pageData.byPass = true
    }
  };
}

watch(()=>pageData.canInput, async newVal => {
  await nextTick()
  myInput.value.focus()
})

defineExpose({
  pageData
})
</script>

<template>

      <n-space vertical>
        <n-data-table
          ref="myTable"
          :columns="myTableColumns"
          :data="totalEntry"
          size="medium"
          :row-props="rowProps"
          :max-height="320"
          :min-height="320"
          :row-key="row => row.id"
          :striped="true"
        >
          <template #empty>
            <n-space vertical align="center">
              <Pony1 />
              <n-h3>准备好了就开始吧 ~</n-h3>
            </n-space>
          </template>
        </n-data-table>


    <n-card class="input-panel">
      <n-space vertical>

        <n-text class="table-tip" type="success">
          现在输入的是第{{pageData.currentIndex+1}}句
        </n-text>
        <div>
          <n-input
              :disabled="!pageData.canInput && !pageData.byPass"
              show-count
              :placeholder="holder"
              ref="myInput"
              v-model:value="pageData.currentEntry"
              class="input-box"
              type="textarea"
              @keydown.ctrl.enter="onKey"
              @update:value="addEntry"
          />
        </div>
        <n-space justify="space-between">
          <n-button-group>
          <n-button @click="onKey">提交并下一句</n-button>
        </n-button-group>
          <span class="input-tip">在此输入，按Ctrl+Enter提交并进入下一句</span>
        </n-space>

      </n-space>
    </n-card>
  </n-space>
</template>

<style scoped lang="scss">
.input-panel {
  .input-tip {
    color: grey;
  }
  .input-box {
    font-size: 20px;
  }
}
.table-tip{
  font-size: 16px
}
</style>