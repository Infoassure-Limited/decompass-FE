<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="24">
        <el-skeleton :loading="load" :rows="3" animated />
        <ComplianceStatus
          v-if="selectedProject !== null"
          selected-module="isms"
          :selected-project="selectedProject"
        />
      </el-col>
      <!-- <el-col :md="8">
        <div
          style="background-color: #333333; color: #ffffff; border-radius: 5px"
          class="d-flex fill-height justify-center align-center"
        >
          <div>
            <strong>Management Clauses: 7</strong><br />
            <strong>Annex Controls: 4</strong>
          </div>
          <div class="ml-30px">
            <img :src="`/images/logo/isms.png`" width="150" alt="" />
          </div>
        </div>
      </el-col> -->
    </el-row>
    <el-row>
      <el-col :md="24">
        <AssetRiskAnalysis v-if="selectedClient !== null" :selected-client="selectedClient" />
      </el-col>
    </el-row>
  </div>
  <!-- <el-tabs type="border-card" lazy>
    <el-tab-pane label="COMPLIANCE STATUS" lazy>
      <el-row :gutter="20">
        <el-col :md="16">
          <el-skeleton :loading="load" :rows="3" animated />
          <management-clause
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </el-col>
        <el-col :md="8">
          <el-skeleton :loading="load" :rows="3" animated />
          <gap-assessment-summmary
            v-if="selectedProject !== null"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
          />
        </el-col>
      </el-row>
    </el-tab-pane>
    <el-tab-pane label="RISK MANAGEMENT KPI">
      <AssetRiskAnalysis v-if="selectedClient !== null" :selected-client="selectedClient" />
    </el-tab-pane>
  </el-tabs> -->
</template>

<script>
import ComplianceStatus from '@/views/Dashboard/components/ComplianceStatus.vue'
import AssetRiskAnalysis from './charts/AssetRiskAnalysis.vue'

export default {
  components: {
    ComplianceStatus,
    AssetRiskAnalysis
  },
  data() {
    return {
      selectedProject: null,
      load: false
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    },
    clientActivatedProjects() {
      return this.$store.getters.clientActivatedProjects
    }
  },
  watch: {
    clientActivatedProjects() {
      this.setModuleSlug()
    }
  },
  mounted() {
    this.setModuleSlug()
  },
  methods: {
    setModuleSlug() {
      let selectedProject = null
      this.load = true
      setTimeout(() => {
        this.clientActivatedProjects.forEach((project) => {
          if (project.available_module) {
            if (project.available_module.slug === 'isms') {
              selectedProject = project
            }
          }
        })
        this.selectedProject = selectedProject
        this.load = false
      }, 2000)
    },
    fetchData() {
      this.load = true
      this.registerDialog = false
      const adminDashboardResource = new Resource('reports/admin-data-analysis-dashboard')
      adminDashboardResource
        .list()
        .then((response) => {
          this.dashboardData = response
          this.load = false
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    }
  }
}
</script>
