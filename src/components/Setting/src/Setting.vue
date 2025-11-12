<script setup lang="ts">
import { ElDrawer, ElDivider, ElMessage } from 'element-plus'
import { ref, unref } from 'vue'
import { useI18n } from '@/hooks/web/useI18n'
// import { ThemeSwitch } from '@/components/ThemeSwitch'
import { useCssVar } from '@vueuse/core'
import { useAppStore } from '@/store/modules/app'
import { trim, setCssVar } from '@/utils'
import ColorRadioPicker from './components/ColorRadioPicker.vue'
import InterfaceDisplay from './components/InterfaceDisplay.vue'
// import LayoutRadioPicker from './components/LayoutRadioPicker.vue'
import { useStorage } from '@/hooks/web/useStorage'
import { useClipboard } from '@vueuse/core'
import { useDesign } from '@/hooks/web/useDesign'
import Resource from '@/api/resource'
import store from '@/VuexStore'

const { clear: storageClear } = useStorage('localStorage')

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('setting')

const appStore = useAppStore()

const { t } = useI18n()

const drawer = ref(false)

// set theme to db
const client = store.getters.selectedClient
// 主题色相关
const systemTheme = ref(appStore.getTheme.elColorPrimary)

const setSystemTheme = (color: string) => {
  const updateThemeResource = new Resource('clients/update-theme')
  updateThemeResource
    .update(client.id, { field: 'sidebar_bg', value: color })
    .then(() => {})
    .catch(() => {})

  setCssVar('--el-color-primary', color)
  appStore.setTheme({ elColorPrimary: color })
  const leftMenuBgColor = useCssVar('--left-menu-bg-color', document.documentElement)
  setMenuTheme(trim(unref(leftMenuBgColor) as string))
}

// 头部主题相关
const headerTheme = ref(appStore.getTheme.topHeaderBgColor || '')

const setHeaderTheme = (color: string) => {
  const updateThemeResource = new Resource('clients/update-theme')
  updateThemeResource
    .update(client.id, { field: 'navbar_bg', value: color })
    .then(() => {})
    .catch(() => {})
  appStore.setHeaderTheme(color)
}

// 菜单主题相关
const menuTheme = ref(appStore.getTheme.leftMenuBgColor || '')

const setMenuTheme = (color: string) => {
  appStore.setMenuTheme(color)
}

// 监听layout变化，重置一些主题色
// watch(
//   () => layout.value,
//   (n) => {
//     if (n === 'top' && !appStore.getIsDark) {
//       headerTheme.value = '#fff'
//       setHeaderTheme('#fff')
//     } else {
//       setMenuTheme(unref(menuTheme))
//     }
//   }
// )

// 拷贝
const copyConfig = async () => {
  const { copy, copied, isSupported } = useClipboard({
    source: `
      // 面包屑
      breadcrumb: ${appStore.getBreadcrumb},
      // 面包屑图标
      breadcrumbIcon: ${appStore.getBreadcrumbIcon},
      // 折叠图标
      hamburger: ${appStore.getHamburger},
      // 全屏图标
      screenfull: ${appStore.getScreenfull},
      // 尺寸图标
      size: ${appStore.getSize},
      // 多语言图标
      locale: ${appStore.getLocale},
      // 标签页
      tagsView: ${appStore.getTagsView},
      // 标签页图标
      getTagsViewIcon: ${appStore.getTagsViewIcon},
      // logo
      logo: ${appStore.getLogo},
      // 菜单手风琴
      uniqueOpened: ${appStore.getUniqueOpened},
      // 固定header
      fixedHeader: ${appStore.getFixedHeader},
      // 页脚
      footer: ${appStore.getFooter},
      // 灰色模式
      greyMode: ${appStore.getGreyMode},
      // layout布局
      layout: '${appStore.getLayout}',
      // 暗黑模式
      isDark: ${appStore.getIsDark},
      // 组件尺寸
      currentSize: '${appStore.getCurrentSize}',
      // 主题相关
      theme: {
        // 主题色
        elColorPrimary: '${appStore.getTheme.elColorPrimary}',
        // 左侧菜单边框颜色
        leftMenuBorderColor: '${appStore.getTheme.leftMenuBorderColor}',
        // 左侧菜单背景颜色
        leftMenuBgColor: '${appStore.getTheme.leftMenuBgColor}',
        // 左侧菜单浅色背景颜色
        leftMenuBgLightColor: '${appStore.getTheme.leftMenuBgLightColor}',
        // 左侧菜单选中背景颜色
        leftMenuBgActiveColor: '${appStore.getTheme.leftMenuBgActiveColor}',
        // 左侧菜单收起选中背景颜色
        leftMenuCollapseBgActiveColor: '${appStore.getTheme.leftMenuCollapseBgActiveColor}',
        // 左侧菜单字体颜色
        leftMenuTextColor: '${appStore.getTheme.leftMenuTextColor}',
        // 左侧菜单选中字体颜色
        leftMenuTextActiveColor: '${appStore.getTheme.leftMenuTextActiveColor}',
        // logo字体颜色
        logoTitleTextColor: '${appStore.getTheme.logoTitleTextColor}',
        // logo边框颜色
        logoBorderColor: '${appStore.getTheme.logoBorderColor}',
        // 头部背景颜色
        topHeaderBgColor: '${appStore.getTheme.topHeaderBgColor}',
        // 头部字体颜色
        topHeaderTextColor: '${appStore.getTheme.topHeaderTextColor}',
        // 头部悬停颜色
        topHeaderHoverColor: '${appStore.getTheme.topHeaderHoverColor}',
        // 头部边框颜色
        topToolBorderColor: '${appStore.getTheme.topToolBorderColor}'
      }
    `,
    legacy: true
  })
  if (!isSupported) {
    ElMessage.error(t('setting.copyFailed'))
  } else {
    await copy()
    if (unref(copied)) {
      ElMessage.success(t('setting.copySuccess'))
    }
  }
}

// 清空缓存
const clear = () => {
  storageClear()
  window.location.reload()
}
</script>

<template>
  <div
    v-if="store.getters.userData.login_as === 'admin'"
    :class="prefixCls"
    class="fixed top-[45%] right-0 w-40px h-40px flex items-center justify-center bg-[var(--el-color-info)] cursor-pointer z-10"
    @click="drawer = true"
  >
    <Icon icon="vi-ant-design:setting-outlined" color="#fff" />
  </div>

  <ElDrawer v-model="drawer" direction="rtl" size="350px" :z-index="4000">
    <template #header>
      <span class="text-16px font-700">{{ t('setting.projectSetting') }}</span>
    </template>

    <div class="text-center">
      <!-- 主题 -->
      <!-- <ElDivider>{{ t('setting.theme') }}</ElDivider>
      <ThemeSwitch /> -->

      <!-- 布局 -->
      <!-- <ElDivider>{{ t('setting.layout') }}</ElDivider>
      <LayoutRadioPicker /> -->

      <!-- 系统主题 -->
      <ElDivider>{{ t('setting.systemTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="systemTheme"
        :schema="[
          '#f19710',
          '#409eff',
          '#009688',
          '#536dfe',
          '#ff5c93',
          '#ee4f12',
          '#0096c7',
          '#9c27b0'
        ]"
        @change="setSystemTheme"
      />

      <!-- 头部主题 -->
      <ElDivider>{{ t('setting.headerTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="headerTheme"
        :schema="['#151515', '#5172dc', '#e74c3c', '#24292e', '#394664', '#009688', '#fff']"
        @change="setHeaderTheme"
      />

      <!-- 菜单主题 -->
      <ElDivider>{{ t('setting.menuTheme') }}</ElDivider>
      <ColorRadioPicker
        v-model="menuTheme"
        :schema="[
          '#001529',
          '#212121',
          '#273352',
          '#191b24',
          '#383f45',
          '#001628',
          '#344058',
          '#fff'
        ]"
        @change="setMenuTheme"
      />
    </div>

    <!-- 界面显示 -->
    <ElDivider>{{ t('setting.interfaceDisplay') }}</ElDivider>
    <InterfaceDisplay />

    <ElDivider />
    <div>
      <BaseButton type="primary" class="w-full" @click="copyConfig">{{
        t('setting.copy')
      }}</BaseButton>
    </div>
    <div class="mt-5px">
      <BaseButton type="danger" class="w-full" @click="clear">
        {{ t('setting.clearAndReset') }}
      </BaseButton>
    </div>
  </ElDrawer>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{adminNamespace}-setting';

.@{prefix-cls} {
  border-radius: 6px 0 0 6px;
}
</style>
