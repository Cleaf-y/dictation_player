<script setup>
import {Heart48Regular} from '@vicons/fluent'
import {ref, reactive} from 'vue'
import {useConfigStore} from "../store/index.js";
const configStore = useConfigStore()

const showModal = ref(false)

const myTableColumns = [
  {
    title: '序号',
    key: 'id',
    width: 60
  },
  {
    title: '标题',
    key: 'title',
    width: 350
  },
  {
    title: '时间',
    key: 'datetime',
    width: 150
  },
  {
    title: '用时',
    key: 'duration',
    width: 150
  }
]
const myHistory = reactive([
  {
    id:1,
    title: 'TPO1-ListeningPassage1',
    datetime: '2021-08-01 12:00:00',
    duration: '35:22'
  }
])
</script>

<template>
  <n-card>
    <template #header>
      Welcome, {{configStore.userName}}
    </template>
    <n-space vertical align="center">
      <n-space space="space-between" align="center">

      </n-space>
    </n-space>
  </n-card>
  <n-card title="学习记录">
    <n-data-table
      :pagination="{pageSize: 6}"
      :columns="myTableColumns"
      :data="myHistory"
      size="medium"
      min-height="320"
      max-height="320"
    >

    </n-data-table>
  </n-card>
  <div class="about">
    <n-button text @click="showModal = true"><n-text type="success">关于</n-text></n-button>
  </div>

  <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space vertical align="center">
        <n-h3>Dictation App</n-h3>
        <n-icon :size="64" :component="Heart48Regular"></n-icon>
        <n-h3>献给我最爱的Munira</n-h3>
      </n-space>
      <template #footer>
        <n-space justify="space-between">
          <n-text type="success">Ver 1.0</n-text>
          <n-text>&#9400; 神奇的东方树叶 </n-text>
        </n-space>
      </template>
    </n-card>
  </n-modal>
</template>

<style lang="scss" scoped>
.about {
  position: fixed;
  bottom: 25px;
  left: 35px;
}
</style>