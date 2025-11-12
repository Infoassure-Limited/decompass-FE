<template>
  <v-carousel height="250" :show-arrows="false" cycle hide-delimiter-background>
    <v-carousel-item v-for="(availableModule, i) in availableModules" :key="i">
      <v-sheet color="#333333" height="100%">
        <div class="d-flex fill-height justify-center align-center">
          <div>
            <img :src="`/images/logo/${availableModule.slug}.png`" width="200" alt="" />
          </div>
          <div class="ml-40px">
            <h1 style="color: #ffffff">{{ availableModule.name }}</h1>
            <span>{{ availableModule.full_name }}</span>
          </div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'
export default {
  props: {
    availableModules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      colors: ['grey', 'warning', 'pink darken-2', 'red lighten-1', 'deep-purple accent-4'],
      slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth']
    }
  },
  methods: {
    themeColor() {
      const root = document.documentElement
      const primaryBgColor = root.style.getPropertyValue('--el-color-primary')
      return changeOpacityOfHexaColorCode(primaryBgColor, 0.3)
    }
  }
}
</script>
