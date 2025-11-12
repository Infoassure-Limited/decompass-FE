<template>
  <div>
    <el-row :gutter="20">
      <el-col :md="24">
        <el-skeleton :loading="load" :rows="3" animated />
        <ComplianceStatus
          v-if="selectedProject !== null"
          selected-module="bcms"
          :selected-project="selectedProject"
        />
      </el-col>
      <!-- <el-col :md="8">
        <div
          style="background-color: #333333; color: #ffffff; border-radius: 5px"
          class="d-flex fill-height justify-center align-center"
        >
          <div> <strong>Requirements: 7</strong><br /> </div>
          <div class="ml-40px">
            <img :src="`/images/logo/bcms.png`" width="150" alt="" />
          </div>
        </div>
      </el-col> -->
    </el-row>
    <el-row>
      <el-col :md="24">
        <el-card>
          <BIADataAnalysis v-if="selectedClient !== null" :selected-client="selectedClient" />
        </el-card>
      </el-col>
    </el-row>
  </div>
  <!-- <el-tabs type="border-card" lazy>
    <el-tab-pane label="BIA ANALYSIS" lazy>
      <BIADataAnalysis v-if="selectedClient !== null" :selected-client="selectedClient" />
    </el-tab-pane>
    <el-tab-pane label="RISK ASSESSMENT KPI">
      <risk-assessment-analysis
        v-if="selectedClient !== null"
        :selected-client="selectedClient"
        module="bcms"
      />
    </el-tab-pane>
  </el-tabs> -->
</template>

<script>
import ComplianceStatus from '@/views/Dashboard/components/ComplianceStatus.vue'
import BIADataAnalysis from './charts/BIADataAnalysis.vue'
// import RiskAssessmentAnalysis from '@/views/dashboard/others/partials/EnterpriseRiskAssessmentAnalysis.vue'

export default {
  components: {
    BIADataAnalysis,
    ComplianceStatus
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
            if (project.available_module.slug === 'bcms') {
              selectedProject = project
            }
          }
        })
        this.selectedProject = selectedProject
        this.load = false
      }, 2000)
    }
  }
}
</script>
