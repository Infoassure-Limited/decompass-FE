<template>
  <div>
    <h3>Configure Performance & Monitoring</h3>
    <el-tabs>
      <el-tab-pane label="Categories of Infomation Needs">
        <InfoNeedsCategories />
      </el-tab-pane>
      <el-tab-pane label="Information Needs">
        <InfoNeeds />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import InfoNeedsCategories from '@/views/modules/ModuleSetup/PAM/InfoNeedsCategories.vue'
import InfoNeeds from '@/views/modules/ModuleSetup/PAM/InfoNeeds.vue'
export default {
  components: {
    InfoNeeds,
    InfoNeedsCategories
  }
}
</script>
