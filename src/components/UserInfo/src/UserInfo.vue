<script setup lang="ts">
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useI18n } from '@/hooks/web/useI18n'
import { useDesign } from '@/hooks/web/useDesign'
import LockDialog from './components/LockDialog.vue'
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/VuexStore'
import LoginAs from '@/views/modules/user/LoginAs.vue'

import { useCounter, useIdle } from '@vueuse/core'

const { inc } = useCounter()

const { idle, reset } = useIdle(20 * 60 * 1000) // 20 min
const countDown = ref(10) // seconds
const intervalId = ref<NodeJS.Timeout | null>(null) // Use ref to store the interval ID reactively

const startInterval = () => {
  intervalId.value = setInterval(() => {
    if (countDown.value < 1) {
      logOut()
      stopInterval()
      return
    }
    countDown.value--
  }, 1000)
}

const stopInterval = () => {
  if (intervalId.value !== null) {
    clearInterval(intervalId.value)
    intervalId.value = null // Reset the ID after clearing
  }
}
onUnmounted(() => {
  stopInterval() // Call the stop function to clear the interval
})
watch(idle, (idleValue) => {
  if (idleValue) {
    inc()
    open()
  } else {
    showScreenTimeoutModal.value = false
    countDown.value = 10
    reset() // restarts the idle timer. Does not change lastActive value
    stopInterval()
  }
})
const open = () => {
  showScreenTimeoutModal.value = true
  startInterval()
}
const { push } = useRouter()

// const userStore = useUserStore()

const userData = computed(() => store.getters.userData)
const baseServerUrl = computed(() => store.getters.baseServerUrl)
// const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const { t } = useI18n()

const logOut = async () => {
  await store.dispatch('user/logout')
  push('/login').catch(() => {})
}

const dialogVisible = ref<boolean>(false)
const showModal = ref<boolean>(false)
const showScreenTimeoutModal = ref<boolean>(false)
// 锁定屏幕
// const lockScreen = () => {
//   dialogVisible.value = true
// }

// const toDocument = () => {
//   window.open('https://element-plus-admin-doc.cn/')
// }

// const toPage = (path: string) => {
//   push(path)
// }
</script>

<template>
  <ElDropdown class="custom-hover" :class="prefixCls" trigger="click">
    <div class="flex items-center">
      <img
        :src="baseServerUrl + 'storage/' + userData.photo"
        alt="Photo"
        onerror="this.src='/images/profile-image.png'"
        class="w-[calc(var(--logo-height)-25px)] rounded-[50%]"
      />
      <span class="<lg:hidden text-14px pl-[5px] text-[var(--top-header-text-color)]">
        {{ userData.name }}<br />
        <small>
          <em>Role: {{ userData.login_as ? userData.login_as.toUpperCase() : '' }}</em>
        </small>
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <div @click="$router.push('/user/profile').catch(() => {})"> Profile </div>
        </ElDropdownItem>
        <ElDropdownItem>
          <div @click="showModal = true"> Change Role </div>
        </ElDropdownItem>
        <!-- <ElDropdownItem>
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided>
          <div @click="lockScreen">{{ t('lock.lockScreen') }}</div>
        </ElDropdownItem> -->
        <ElDropdownItem>
          <div @click="logOut">{{ t('common.logOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />
  <!-- <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport> -->
  <el-dialog title="Change Role" v-model="showModal" width="30%">
    <LoginAs />
  </el-dialog>
  <el-dialog
    v-model="showScreenTimeoutModal"
    width="50%"
    title="Idle Screen Timeout Warning"
    append-to-body
  >
    <span>
      Hello! Are you still here? <br />
      You will be logged out in <strong>{{ countDown }} seconds</strong>. <br />
      To continue, just hover your cursor on the screen
    </span>
  </el-dialog>
</template>

<style scoped lang="less">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
