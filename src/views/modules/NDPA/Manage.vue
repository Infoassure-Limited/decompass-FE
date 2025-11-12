<template>
  <div>
    <div v-if="moduleIsActive || isAdmin">
      <el-row :gutter="5">
        <el-col :md="8">
          <p>Activities of the NDPA Module</p>
        </el-col>
        <!-- <el-col :md="8">
          <el-select
            v-model="selectedProject"
            placeholder="Select Project"
            value-key="id"
            filterable
            style="width: 100%;"
          >
            <el-option
              v-for="(proj, project_index) in projects"
              :key="project_index"
              :value="proj"
              :label="proj.title"
            >
              <span style="float: left">{{ proj.title }}</span>
              <span style="float: right; color: #8492a6;">{{ proj.year }}</span>
            </el-option>
          </el-select>
        </el-col> -->
      </el-row>
      <p></p>
      <div v-if="selectedProject !== null">
        <el-row :gutter="5">
          <el-col :md="24">
            <el-button-group>
              <!-- <el-button
                id="business_unit"

                type="secondary"
                @click="setView('business_unit')"
              >
                <img
                  src="/images/project-icons/business-unit.png"
                  width="30"
                >
                Business Units
              </el-button> -->
              <el-button
                v-if="selectedProject.feature_slug.includes('compliance')"
                id="gap_assessment"
                type="secondary"
                @click="setView('gap_assessment')"
              >
                <img src="/images/project-icons/gap-assessment.png" width="30" />
                Compliance Assessment
              </el-button>
              <el-button
                v-if="selectedProject.feature_slug.includes('pda')"
                id="pda"
                type="secondary"
                @click="setView('pda')"
              >
                <img src="/images/project-icons/pda.png" width="30" />
                PDA
              </el-button>
              <el-button
                v-if="selectedProject.feature_slug.includes('ropa')"
                id="ropa"
                type="secondary"
                @click="setView('ropa')"
              >
                <img src="/images/project-icons/ropa.png" width="30" />
                RoPA
              </el-button>
              <el-button
                v-if="selectedProject.feature_slug.includes('dpia')"
                id="risk_library"
                type="secondary"
                @click="setView('risk_library')"
              >
                <img src="/images/project-icons/risk_library.png" width="30" />
                Risk & Controls
              </el-button>
              <el-button
                v-if="selectedProject.feature_slug.includes('dpia')"
                id="dpia"
                type="secondary"
                @click="setView('dpia')"
              >
                <img src="/images/project-icons/dpia.png" width="30" />
                DPIA
              </el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <p></p>
        <div>
          <business-unit v-if="current_view === 'business_unit'" />
          <gap-assessment
            v-if="current_view === 'gap_assessment'"
            :selected-client="selectedClient"
            :selected-project="selectedProject"
            :is-admin="isAdmin"
          />
          <risk-assessment
            v-if="current_view === 'dpia'"
            module="ndpa"
            view-only="ndpa"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
            :is-admin="isAdmin"
          />
          <!-- <d-p-i-a
            v-if="current_view === 'dpia'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
          /> -->
          <ro-p-a
            v-if="current_view === 'ropa'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
            :is-admin="isAdmin"
          />
          <p-d-a
            v-if="current_view === 'pda'"
            :selected-client="selectedClient"
            :standard-id="selectedProject.standard_id"
          />
          <risk-library
            v-if="current_view === 'risk_library'"
            module="ndpa"
            view-only="ndpa"
            :is-admin="isAdmin"
          />
        </div>
      </div>
    </div>
    <!-- <div
        v-else
        align="center"
      >
        <img
          src="//images/caution.png"
          width="300"
          alt="NOT FOUND"
        >
        <br>
        <br>
        <br>
        <h3>MODULE NOT ACTIVE</h3>
      </div> -->
  </div>
</template>

<script>
import BusinessUnit from '@/views/modules/business-units/SetUp.vue'
import GapAssessment from './partials/GapAssessment.vue'
import RiskLibrary from '@/views/modules/settings/partials/RiskAndThreats/ViewRiskControlMatrix.vue'
// import RiskLibrary from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
import RiskAssessment from '@/views/modules/risk-assessment/index.vue'

// import DPIA from './DPIA/index.vue'
import RoPA from './RoPA/index.vue'
import PDA from './PDA/index.vue'
// import ProjectPlanDetails from './ProjectPlanDetails.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BusinessUnit,
    GapAssessment,
    RiskAssessment,
    RoPA,
    PDA,
    RiskLibrary
    // ProjectPlanDetails,
  },
  props: {
    project: {
      type: Object,
      default: () => null
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      current_view: 'gap_assessment',
      assessment_activities_array: [],
      moduleIsActive: false,
      projects: [],
      selectedProject: null
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
      this.checkIfProjectIsActive()
    },
    selectedClient() {
      this.checkIfProjectIsActive()
    }
  },
  created() {
    this.selectedProject = this.project
    if (this.selectedClient.id !== null) {
      this.checkIfProjectIsActive()
    }
    setTimeout(() => {
      this.setView('gap_assessment')
    }, 5000)
  },
  methods: {
    checkPermission,
    checkIfProjectIsActive() {
      const projects = this.clientActivatedProjects.filter(
        (project) => project.available_module.slug === 'ndpa'
      )
      this.moduleIsActive = false
      if (projects.length > 0) {
        this.moduleIsActive = true
        this.projects = projects

        this.selectedProject = projects[0]
      }
    },
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
      const divs = document.getElementsByClassName('btn')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      for (let i = 0; i < divs.length; i++) {
        const current = document.getElementsByClassName('btn btn-secondary')
        // If there's no activeCard class
        if (current.length > 0) {
          current[0].className = current[0].className.replace(
            'btn btn-secondary',
            'btn btn-secondary'
          )
        }
      }
      document.getElementById(viewId).className = 'btn btn-secondary'
    }
  }
}
</script>
