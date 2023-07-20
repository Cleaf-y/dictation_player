<script setup>
import {ref} from "vue";
import { useRouter } from 'vue-router'
const router = useRouter()

import {
  HomeOutlined,
  EditNoteOutlined,
  PersonOutlineFilled,
  GroupRound,
  SettingsSharp
} from "@vicons/material";
import { NIcon } from "naive-ui";
const menuOptions = [
  {
    label: "主页",
    key: 'Home',
    icon: renderIcon(HomeOutlined),
  },
  {
    label: "精听",
    key: 'Listen',
    icon: renderIcon(EditNoteOutlined),
    children: [
      {
        label: "本地",
        key: 'Resources',
        icon: renderIcon(PersonOutlineFilled),
      },
      {
        label: "在线",
        key: 'Online',
        icon: renderIcon(GroupRound),
      }
    ]
  },
  {
    label: "配置",
    key: 'Config',
    icon: renderIcon(SettingsSharp),
  }
]
function renderIcon(icon) {
  return ()=> h(NIcon, null, { default: () => h(icon) })
}

const currentPage = ref("Home")
function handleSelect(name) {
  console.log(name, currentPage.value)
  if(currentPage.value!=="Home"){
    dialog.info({
      title: "退出",
      content: "确定要离开当前页面吗？",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        toPage(name)
      }
    })
  } else {
    toPage(name)
  }
}
function toPage(name){
  currentPage.value = name
  router.push({
    name
  })
}

import { useDialog } from "naive-ui";
import {appWindow} from "@tauri-apps/api/window";
const dialog = useDialog()
function handleExit(){
  dialog.info({
    title: "退出",
    content: "确定要退出吗？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      appWindow.close()
    }
  })
}

import {useConfigStore} from "../store/index.js";
const configStore = useConfigStore()
function handleChangeTheme(){
  configStore.changeTheme()
}

import {DarkModeOutlined, LightModeFilled} from "@vicons/material";

</script>

<template>
  <n-card class="base">
    <div class="header">
      <n-space data-tauri-drag-region justify="space-between" align="center">
        <n-menu :value="currentPage" mode="horizontal" :options="menuOptions" @update:value="handleSelect"></n-menu>
        <div class="header-right-control">
          <n-space justify="space-around" align="center">
            <n-button quaternary size="medium" @click="handleChangeTheme">
              <template #icon>
                <n-icon size="24">
                  <DarkModeOutlined v-if="configStore.isDark"/>
                  <LightModeFilled v-if="!configStore.isDark" />
                </n-icon>
              </template>
            </n-button>
            <n-button size="medium" @click="handleExit" text>退出</n-button>
          </n-space>
        </div>
      </n-space>
    </div>
    <div class="page-content">
      <router-view></router-view>
    </div>
  </n-card>

</template>

<style scoped lang="scss">
.page-content {
  padding: 25px 20px 20px 10px;
}
.base {
  height: 100vh;
  border-radius: 15px;
}

</style>