<template>
  <div>
    <h3>Risks Management Setup</h3>
    <el-tabs v-if="selectedClient !== null" type="border-card">
      <el-tab-pane label="Risk Category" :lazy="true">
        <risk-categories />
      </el-tab-pane>
      <el-tab-pane label="Risk Library" :lazy="true">
        <view-risk-control-matrix />
      </el-tab-pane>
      <el-tab-pane label="Risk Matrix" :lazy="true">
        <risk-matrix />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RiskCategories from './RiskCategories.vue'
import RiskMatrix from './RiskMatrix.vue'
import ViewRiskControlMatrix from './ViewRiskControlMatrix.vue'

export default {
  components: {
    RiskCategories,
    ViewRiskControlMatrix,
    RiskMatrix
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  created() {
    this.fetchClients()
  },
  methods: {
    fetchClients() {
      this.$store.dispatch('clients/fetchClients')
    }
  }
}
</script>
