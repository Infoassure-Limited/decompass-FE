<template>
  <div>
    <el-row :gutter="5">
      <!-- <el-col :md="4">
      <div class="card">
        <div class="project-menu">
          <feather-icon
            size="36"
            icon="LayersIcon"
          />
          <p>Project Plan</p>
        </div>
      </div>
    </el-col> -->
      <!-- <el-col :md="4">
        <div id="gap_assessment" class="card activeCard" @click="setView('gap_assessment')">
          <div class="project-menu">
            <img src="/images/project-icons/gap-assessment.png" />
            <p>Gap Assessment</p>
          </div>
        </div>
      </el-col> -->
      <el-col v-if="assessment_activities_array.includes('risk_assessment')" :md="4">
        <div id="risk_assessment" class="card" @click="setView('risk_assessment')">
          <div class="project-menu">
            <img src="/images/project-icons/risk-assessment.png" />
            <p>Risk Assessment</p>
          </div>
        </div>
      </el-col>
      <el-col v-if="assessment_activities_array.includes('soa')" :md="4">
        <div id="soa" class="card" @click="setView('soa')">
          <div class="project-menu">
            <img src="/images/project-icons/soa.png" />
            <p>SOA</p>
          </div>
        </div>
      </el-col>
      <el-col v-if="assessment_activities_array.includes('pda')" :md="4">
        <div id="pda" class="card" @click="setView('pda')">
          <div class="project-menu">
            <img src="/images/project-icons/pda.png" />
            <p>PDA</p>
          </div>
        </div>
      </el-col>
      <el-col v-if="assessment_activities_array.includes('ropa')" :md="4">
        <div id="ropa" class="card" @click="setView('ropa')">
          <div class="project-menu">
            <img src="/images/project-icons/ropa.png" />
            <p>RoPA</p>
          </div>
        </div>
      </el-col>
      <el-col v-if="assessment_activities_array.includes('dpia')" :md="4">
        <div id="dpia" class="card" @click="setView('dpia')">
          <div class="project-menu">
            <img src="/images/project-icons/dpia.png" />
            <p>DPIA</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div>
      <!-- <gap-assessment
        v-if="current_view === 'gap_assessment'"
        :selected-client="selectedClient"
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      /> -->
      <risk-assessment
        v-if="current_view === 'risk_assessment'"
        :selected-client="selectedClient"
        :standard-id="selectedProject.standard_id"
      />
      <!-- <d-p-i-a
        v-if="current_view === 'dpia'"
        :selected-client="selectedClient"
        :standard-id="selectedProject.standard_id"
      />
      <ro-p-a
        v-if="current_view === 'ropa'"
        :selected-client="selectedClient"
        :standard-id="selectedProject.standard_id"
      />
      <p-d-a
        v-if="current_view === 'pda'"
        :selected-client="selectedClient"
        :standard-id="selectedProject.standard_id"
      /> -->
      <s-o-a
        v-if="current_view === 'soa'"
        :selected-client="selectedClient"
        :standard-id="selectedProject.standard_id"
      />
    </div>
  </div>
  <!-- <el-tabs
    type="border-card"
  >
    <el-tael-pane lazy>
      <template slot="label">
        <feather-icon icon="LayersIcon" />
        <el-col>Project Plan in Phases</el-col>
      </template>
      <project-plan-details
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </el-tael-pane>
    <el-tael-pane lazy>
      <template slot="label">
        <feather-icon icon="FileTextIcon" />
        <el-col>Project Activities</el-col>
      </template>
      <project-activities
        :selected-client="selectedClient"
        :selected-project="selectedProject"
        :is-admin="isAdmin"
      />
    </el-tael-pane>
  </el-tabs> -->
</template>

<script>
// import {
//   BTabs, BTab,
// } from 'bootstrap-vue'
// import GapAssessment from './GapAssessment.vue'
// import DPIA from '@/views/modules/DPIA/index.vue'
import SOA from '@/views/modules/statement-of-applicability/StatementOfApplicability.vue'
// import RoPA from '@/views/modules/RoPA/index.vue'
// import PDA from '@/views/modules/PDA/index.vue'
import RiskAssessment from '@/views/modules/risk-assessment/index.vue'
// import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    // BTabs,
    // BTab,
    // GapAssessment,
    // DPIA,
    // RoPA,
    // PDA,
    RiskAssessment,
    SOA
    // ProjectPlanDetails,
  },
  props: {
    selectedClient: {
      type: Object,
      required: true
    },
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      current_view: 'gap_assessment',
      assessment_activities_array: []
    }
  },
  created() {
    this.setAssessmentActivities()
  },
  methods: {
    checkPermission,
    setAssessmentActivities() {
      const { standard } = this.selectedProject
      const assessmentActivities = standard.assessment_activities
      this.assessment_activities_array =
        assessmentActivities !== null ? assessmentActivities.split('|') : []
    },
    setView(viewId) {
      this.current_view = viewId
      this.changeActiveTabBgColor(viewId)
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      for (let i = 0; i < divs.length; i++) {
        const current = document.getElementsByClassName('activeCard')
        // If there's no activeCard class
        if (current.length > 0) {
          current[0].className = current[0].className.replace(' activeCard', '')
        }
      }
      document.getElementById(viewId).className += ' activeCard'
    }
  }
}
</script>
<style scoped>
.project-menu {
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  padding: 10px;
}
.card {
  border: 1px solid #ebeef5;
  background-color: #fff;
  border-radius: 5px;
  color: #303133;
}
.card :hover {
  background-color: #3458cf;
  border-radius: 5px;
  color: #ffffff;
}
.activeCard {
  background-color: #0b173d;
  border-radius: 5px;
  color: #ffffff;
}
</style>
