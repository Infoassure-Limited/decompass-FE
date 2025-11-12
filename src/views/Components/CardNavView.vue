<template>
  <el-card
    class="special-card"
    :id="id"
    style="background: #fcfcfc; border: 1px #888888 solid; cursor: pointer; margin: 5px"
    shadow="hover"
    @click="viewDetails(id)"
  >
    <div style="cursor: pointer">
      <strong><icon v-if="titleIcon" :icon="titleIcon" />{{ title }}</strong>
      <el-tag v-if="tagLabel !== ''" class="pull-right" effect="dark" type="success" round>
        {{ tagLabel }}
      </el-tag>
      <slot name="description"></slot>
    </div>
  </el-card>
</template>
<script>
import { changeOpacityOfHexaColorCode } from '@/utils/tsxHelper'

export default {
  components: {
    // BModal,
    // CreateAsset
    // EditAsset
  },
  props: {
    id: {
      type: String,
      default: () => null
    },
    title: {
      type: String,
      default: null
    },
    titleIcon: {
      type: String,
      default: null
    },
    tagLabel: {
      type: String,
      default: () => ''
    }
  },
  methods: {
    viewDetails(viewId) {
      this.changeActiveTabBgColor(viewId)
    },
    changeActiveTabBgColor(viewId) {
      const root = document.documentElement // Get the root element (<html>)
      // root.style.setProperty('--el-color-primary', '#ff0000')
      const primaryBgColor = root.style.getPropertyValue('--el-color-primary')
      const divs = document.getElementsByClassName('special-card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      if (divs.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.border = '#888888 solid 1px'
          divs[i].style.color = '#000000'
        }
      }
      const doc = document.getElementById(viewId)
      if (doc !== undefined && doc !== null) {
        // Now we know that foo is defined, we are good to go.
        doc.style.border = `${changeOpacityOfHexaColorCode(primaryBgColor, 1)} solid 3px`
      }
      this.$emit('clickToView', viewId)
      // document.getElementById(viewId).style.color = '#ffffff'
    }
  }
}
</script>
