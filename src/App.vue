<script setup>
import Wrapper from "./pages/Wrapper.vue";

import {useConfigStore} from "./store/index.js";
const configStore = useConfigStore()

document.oncontextmenu = function(event) {
  try {
    let eventTarget = event.target;
    return (eventTarget.tagName === 'INPUT' && eventTarget.type.toLowerCase() === 'text') ||
        eventTarget.tagName === 'TEXTAREA';

  } catch (e) {
    return false;
  }
}
</script>

<template>
  <div class="dragger"></div>
<n-config-provider :theme="configStore.currentTheme">
  <n-dialog-provider>
    <n-notification-provider placement="bottom-right">
      <n-message-provider>
        <Wrapper />
      </n-message-provider>
    </n-notification-provider>
  </n-dialog-provider>
</n-config-provider>
</template>

<style lang="scss" scoped>
.dragger {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 8%;
}
</style>