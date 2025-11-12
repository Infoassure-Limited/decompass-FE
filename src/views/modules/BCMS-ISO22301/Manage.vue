<template>
  <div>
    <el-row :gutter="5">
      <el-col :md="24">
        <el-button-group>
          <el-button
            id="business_unit"
            variant="outline-secondary"
            @click="setView('business_unit')"
          >
            <img src="/images/project-icons/business-unit.png" width="30" />
            Business Units
          </el-button>
          <el-button id="bia" variant="outline-secondary" @click="setView('bia')">
            <img src="/images/project-icons/bia.png" width="30" />
            BIA
          </el-button>
          <el-button id="rcm" variant="outline-secondary" @click="setView('rcm')">
            <img src="/images/project-icons/risk_library.png" width="30" />
            Risk & Controls
          </el-button>
          <el-button
            id="risk_assessment"
            variant="outline-secondary"
            @click="setView('risk_assessment')"
          >
            <img src="/images/project-icons/risk-assessment.png" width="30" />
            Risk Assessment
          </el-button>
        </el-button-group>
      </el-col>
    </el-row>
    <div>
      <p></p>
      <business-unit v-if="current_view === 'business_unit'" />
      <el-i-a v-if="current_view === 'bia'" />
      <r-c-m v-if="current_view === 'rcm'" module="bcms" view-only="bcms" />
      <risk-assessment v-if="current_view === 'risk_assessment'" module="bcms" view-only="bcms" />
      <BIA v-if="current_view === 'bia'" />
    </div>
  </div>
</template>

<script>
import BusinessUnit from '@/views/modules/business-units/SetUp.vue'
import BIA from './BIA/Analyze.vue'
import RCM from '@/views/modules/RiskAndThreats/ViewRiskControlMatrix.vue'
import RiskAssessment from '@/views/modules/risk-assessment/index.vue'
import checkPermission from '@/utils/permission'

export default {
  components: {
    BusinessUnit,
    BIA,
    RCM,
    RiskAssessment
  },
  data() {
    return {
      current_view: 'business_unit'
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
  created() {},
  mounted() {
    if (this.selectedClient.id === null) {
      this.$alert('Please select a client to continue')
    }
    this.setView(this.current_view)
  },
  methods: {
    checkPermission,
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
            'btn btn-outline-secondary'
          )
        }
      }
      document.getElementById(viewId).className = 'btn btn-secondary'
    }
  }
}
</script>
