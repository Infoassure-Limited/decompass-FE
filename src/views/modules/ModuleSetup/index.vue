<template>
  <div>
    <h4>Configure & Setup Modules</h4>
    <el-tabs v-model="activeName" @tab-click="forceRerender" type="border-card" lazy>
      <el-tab-pane :key="keyValue" label="BCMS" name="#bcms" lazy>
        <BCMS />
      </el-tab-pane>
      <el-tab-pane :key="keyValue" label="ISMS" name="#isms" lazy>
        <ISMS />
      </el-tab-pane>
      <el-tab-pane :key="keyValue" label="NDPA" name="#ndpa" lazy>
        <NDPA />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ISMS from '@/views/modules/ModuleSetup/ISMS/index.vue'
import NDPA from '@/views/modules/ModuleSetup/NDPA/index.vue'
import BCMS from '@/views/modules/ModuleSetup/BCMS/index.vue'

export default {
  components: {
    BCMS,
    ISMS,
    NDPA
    // FinancialsAndBilling,
    // ContractAndSla,
    // VRM
    // NDPAReport,
  },
  data() {
    return {
      activeName: '#isms',
      keyValue: 1
    }
  },
  mounted() {
    this.setCurrentPage()
  },
  methods: {
    forceRerender(tab, event) {
      // console.log(event.target.id)
      let hashString = event.target.id
      hashString = hashString.replace('tab-', '')
      // this.activeName = value
      this.$router.push({ hash: `${hashString}` })
      this.keyValue += 1
    },
    setCurrentPage() {
      this.activeName = window.location.hash !== '' ? window.location.hash : '#isms'
    }
    // showClicked(tab, event) {
    //   console.log(tab, event)
    // },
  }
}
</script>
