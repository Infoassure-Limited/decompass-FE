<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="12">
        <el-select v-model="selectedVendor" filterable value-key="id" placeholder="Select Vendor">
          <el-option
            v-for="(vendor, index) in vendors"
            :key="index"
            :value="vendor"
            :label="vendor.name"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <el-button type="primary" plain @click="loadResources()">
          <icon icon="tabler:reload" /> Reload
        </el-button>
      </el-col>
    </el-row>
    <div v-if="selectedVendor !== null">
      <el-row :gutter="20">
        <el-col :md="24">
          <OverallRiskRating v-if="showChart" :selected-vendor="selectedVendor" />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :md="16">
          <RAReport v-if="showChart" :selected-vendor="selectedVendor" />
        </el-col>
        <el-col :md="8">
          <RiskRankingMatrix
            :matrix="selectedClient.matrix ? selectedClient.matrix.current_matrix : '3x3'"
          />
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <h3 align="center">
        <img src="/images/no-chart.png" width="150" />
        <p>Please select a Vendor to continue</p>
      </h3>
    </div>
  </div>
</template>

<script>
import RAReport from './charts/RAReport.vue'
import RiskRankingMatrix from '@/views/modules/RiskAndThreats/partials/RiskRankingMatrix.vue'
import OverallRiskRating from './charts/OverallRiskRating.vue'
import Resource from '@/api/resource'

export default {
  components: {
    RAReport,
    RiskRankingMatrix,
    OverallRiskRating
  },
  data() {
    return {
      showChart: true,
      loading: false,
      vendors: [],
      selectedVendor: null
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    this.loadResources()
  },
  methods: {
    fetchDashboardVendors() {
      // const { limit, page } = this.query
      this.loading = true
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list({ all: true }).then((response) => {
        this.vendors = response.vendors
        this.loading = false
      })
    },
    loadResources() {
      this.showChart = false
      setTimeout(() => {
        this.showChart = true
      }, 100)
      this.fetchDashboardVendors()
    }
  }
}
</script>
