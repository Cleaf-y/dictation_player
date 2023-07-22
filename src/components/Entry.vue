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
  canInput: false,
  byPass: false
})
const totalEntry = reactive([])
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
  total: Number
})

const holder = computed(()=>{
  if (props.initial) {
    return "等待开始"
  }
  return pageData.canInput ? "": "第一遍播放中..."
})


function getTotalHeight() {
  let row = document.getElementsByClassName('n-data-table-td')
  let totalHeight = 0
  for(let index=0;index<row.length;index++){
    totalHeight += row[index].scrollHeight
  }
  return totalHeight
}
async function addEntry(){
  if(pageData.currentEntry === ""){
    msg.warning("输入为空")
    return
  }
  totalEntry.push({
    id: totalEntry.length+1,
    content: pageData.currentEntry
  })
  pageData.currentEntry = ""
  await nextTick()
  myTable.value.scrollTo({
    top: getTotalHeight(),
    behavior: 'smooth'
  })
  myInput.value.focus()
}

function onKey() {
  addEntry()
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
  console.log('@', newVal)
  await nextTick()
  myInput.value.focus()
})

defineExpose({
  pageData
})
</script>

<template>
  <n-space vertical>
    <n-card>
      <n-space vertical>
        <n-data-table
          ref="myTable"
          :columns="myTableColumns"
          :data="totalEntry"
          size="small"
          :row-props="rowProps"
          :max-height="260"
          :min-height="260"
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
          <n-text class="table-tip" type="success">
            现在输入的是第{{pageData.currentIndex+1}}句
          </n-text>
      </n-space>
    </n-card>

    <n-card class="input-panel">
      <n-space vertical>
        <span class="input-tip">在此输入，按Ctrl+Enter提交并进入下一句</span>
        <div>
          <n-input
              :disabled="!pageData.canInput && !pageData.byPass"
              show-count
              :placeholder="holder"
              ref="myInput"
              v-model:value="pageData.currentEntry"
              class="input-box"
              type="textarea"
              @keydown.ctrl.enter="onKey"/>
        </div>
        <n-button-group>
          <n-button @click="addEntry">提交</n-button>
          <n-button @click="onKey">提交并下一句</n-button>
          <n-button @click="onStage" disabled>暂存</n-button>
        </n-button-group>
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