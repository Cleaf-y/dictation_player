<script setup>
import {useConfigStore} from "../store/index.js";
const configStore = useConfigStore()
</script>

<template>
  <n-card>
    Welcome, {{configStore.userName}}
  </n-card>
  <n-card>
    精听学习记录
  </n-card>
  <div class="about">
    <n-button text><n-text type="success">关于</n-text></n-button>
  </div>
</template>

<style lang="scss" scoped>
.about {
  position: fixed;
  bottom: 25px;
  left: 35px;
}
</style>