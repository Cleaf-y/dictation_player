<script setup>
import {ref, onBeforeMount} from "vue";
import {useRouter} from "vue-router";
import {getDir} from '../utils/resourcesManager.js'

const myRouter = useRouter()

const files = ref([])
onBeforeMount(()=>{
  getDir().then(res=>{
    files.value = res[0].children
  })
  console.log(myRouter)
})

function toLocal(src, title, father) {
  const baseName = src.split(".")[0]
  const queryData = {
    audio: baseName + ".mp3",
    text: baseName + ".srt",
    title: `${father} - ${title}`
  }
  console.log(queryData)
  myRouter.push({
    name: "Local",
    query: queryData
  })
}
</script>

<template>
    <n-card>
      <template #header>
        <n-text>本地资源</n-text>
      </template>
      <template #header-extra>
        <n-button-group>
          <n-button>刷新</n-button>
          <n-button>导入</n-button>
        </n-button-group>
      </template>
      <n-tabs
          :bar-width="28"
          placement="left"
          type="line"
          pane-class="pane-wrapper"
          animated
      >

        <n-tab-pane v-for="catagory in files" :name="catagory.name" :tab="catagory.name">
          <n-tabs
            placement="top"
            type="card"
            animated
          >
            <n-tab-pane v-for="item in catagory.children" :name="item.name" :tab="item.name">
              <div class="card-wrapper">
                <n-scrollbar style="max-height: 600px" >
                  <n-grid x-gap="12" y-gap="8" :cols="3">
                    <n-gi v-for="f in item.children.filter(filePath => filePath.name.endsWith('.mp3'))">
                        <n-card @click="toLocal(f.path, f.name.split('.')[0], item.name)">{{f.name.split('.')[0]}}</n-card>
                    </n-gi>
                  </n-grid>
                </n-scrollbar>
              </div>
            </n-tab-pane>
          </n-tabs>
        </n-tab-pane>
      </n-tabs>
    </n-card>
</template>

<style lang="scss" scoped>
.pane-wrapper {
  width: 80vw;
  height: 60vh;
}
.card-wrapper {
  padding: 16px;
}
.card {
}
</style>