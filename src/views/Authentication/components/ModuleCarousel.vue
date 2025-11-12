<template>
  <v-carousel height="400" :show-arrows="false" cycle hide-delimiter-background>
    <v-carousel-item v-for="(availableModule, i) in availableModules" :key="i">
      <v-sheet color="transparent" height="100%">
        <div class="d-flex fill-height justify-center align-center">
          <div>
            <img :src="`/images/logo/${availableModule.slug}.png`" width="250" alt="" />
          </div>
          <div class="ml-40px">
            <h1 style="color: #ffffff">{{ availableModule.name }}</h1>
            <span style="color: #ffffff">{{ availableModule.full_name }}</span>
          </div>
        </div>
      </v-sheet>
    </v-carousel-item>
  </v-carousel>
</template>
<script>
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'
export default {
  data() {
    return {
      colors: ['grey', 'warning', 'pink darken-2', 'red lighten-1', 'deep-purple accent-4'],
      availableModules: [
        {
          name: 'BCMS (ISO-22301)',
          full_name: 'Business Continuity Management System',
          slug: 'bcms',
          status: 'Ready'
        },
        {
          name: 'ISMS (ISO-27001)',
          full_name: 'Information Security Management System',
          slug: 'isms',
          status: 'Ready'
        },
        {
          name: 'NDPA',
          full_name: 'Nigeria Data Protection Act',
          slug: 'ndpa',
          status: 'Ready'
        },
        {
          name: 'TPDD',
          full_name: 'Third Party Due Diligence',
          slug: 'vdd',
          status: 'Ready'
        }
      ]
    }
  },
  methods: {
    themeColor() {
      // const root = document.documentElement
      const primaryBgColor = 'transparent' //  root.style.getPropertyValue('--el-color-primary')
      return changeOpacityOfHexaColorCode(primaryBgColor, 0.3)
    }
  }
}
</script>
