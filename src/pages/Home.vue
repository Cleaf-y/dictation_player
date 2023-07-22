<script setup>
import {useConfigStore} from "../store/index.js";
const configStore = useConfigStore()

import {ref} from 'vue'
const showModal = ref(false)

import {Heart48Regular} from '@vicons/fluent'
</script>

<template>
  <n-card>
    Welcome, {{configStore.userName}}
  </n-card>
  <n-card>
    精听学习记录
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