<template>
  <div>
    <!-- <el-row :gutter="20">
      <el-col :md="21">
        <el-button type="text" @click="dialogVisible = true">
          Filter By
          <icon size="30" icon="tabler:filter" />
        </el-button>
      </el-col>
    </el-row> -->
    <div>
      <el-row :gutter="20">
        <el-col :md="24">
          <el-skeleton :loading="load" :rows="3" animated />
          <ComplianceStatus
            v-if="selectedProject !== null"
            selected-module="ndpa"
            :selected-project="selectedProject"
          />
        </el-col>
        <!-- <el-col :md="8">
          <aside class="d-flex fill-height justify-center align-center">
            <div>
              <img :src="`/images/logo/ndpa.png`" width="150" alt="" />
            </div>
            <div class="ml-40px">
              <strong>Parts: 5</strong><br />
              <strong>Sections: 22</strong>
            </div>
          </aside>
        </el-col> -->
      </el-row>
    </div>
    <!-- <el-card v-if="showCharts">
      <template v-slot:header>
        <div>
          <h3>Percentage Completion</h3>
        </div>
      </template>
      <div>
        <el-row :gutter="20">
          <el-col :md="6">
            <gap-assessment-data-analysis
              v-if="selectedProject !== null"
              :selected-client="selectedClient"
              :selected-project="selectedProject"
              :filter-by="param"
            />
          </el-col>
          <el-col :md="18">
            <el-skeleton :loading="load" :rows="6" animated />
            <percentage-completion
              v-if="selectedProject !== null"
              :selected-client="selectedClient"
              :selected-project="selectedProject"
              :filter-by="param"
            />
          </el-col>
        </el-row>
      </div>
    </el-card> -->
    <!-- <el-card>
      <div slot="header">

        <h3>DPIA KPI</h3>
      </div>
      <div>
        <d-p-i-a-data-analysis
          v-if="selectedClient !== null"
          :selected-client="selectedClient"
          module="ndpa"
        />
      </div>
    </el-card> -->
    <el-dialog title="Filter By" v-model="dialogVisible" width="40%">
      <el-row :gutter="20">
        <el-col :md="24">
          <el-radio-group v-model="group_by" @change="checkIfFieldIsEmpty()">
            <el-radio
              v-for="array in [
                { label: 'Parts', value: 'clause_id' },
                { label: 'Sections', value: 'section_id' },
                { label: 'Assignee', value: 'assignee_id' }
              ]"
              :key="array.value"
              :label="array.value"
              border
            >
              {{ array.label }}
            </el-radio>
          </el-radio-group>
        </el-col>
        <el-col v-if="group_by === 'section_id'" :md="24">
          <label for="">Select Part</label>
          <el-select
            v-model="clause_id"
            placeholder="Select Part"
            filterable
            style="width: 100%"
            @input="checkIfFieldIsEmpty()"
          >
            <el-option
              v-for="(clause, index) in clauses"
              :key="index"
              :value="clause.id"
              :label="`${clause.name} - ${clause.description}`"
            />
          </el-select>
        </el-col>
        <el-col v-if="group_by === 'assignee_id'" :md="24">
          <label for="">Select Assignee</label>
          <el-select
            v-model="assignee_id"
            placeholder="Select Assignee"
            filterable
            style="width: 100%"
            @input="checkIfFieldIsEmpty()"
          >
            <el-option
              v-for="(user, user_index) in clientUsers"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            />
          </el-select>
        </el-col>
      </el-row>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            :disabled="fieldIsEmpty"
            @click="(setViewBy(), (dialogVisible = false))"
            >Fetch</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// import GapAssessmentDataAnalysis from './partials/GapAssessmentDataAnalysis.vue'
// import DPIADataAnalysis from './charts/DPIADataAnalysis.vue'
// import DPIADataAnalysis from '@/views/dashboard/others/partials/EnterpriseRiskAssessmentAnalysis.vue'
import ComplianceStatus from '@/views/Dashboard/components/ComplianceStatus.vue'
// import ManagementClause from './charts/ManagementClause.vue'
import PercentageCompletion from './charts/PercentageCompletion.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // GapAssessmentDataAnalysis,
    // DPIADataAnalysis,
    ComplianceStatus
    // ManagementClause
    // PercentageCompletion
  },
  data() {
    return {
      title: 'Compliance Status',
      view: 'compliance_status',
      selectedProject: null,
      load: false,
      showCharts: true,
      dialogVisible: false,
      group_by: 'clause_id',
      clauses: [],
      clientUsers: [],
      clause_id: '',
      assignee_id: '',
      param: {
        group_by: 'clause_id',
        clause_id: '',
        assignee_id: '',
        date: ''
      },
      fieldIsEmpty: true
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
    // this.fetchClauses()
    // this.fetchClientUsers()
    // this.checkIfFieldIsEmpty()
  },
  methods: {
    checkIfFieldIsEmpty() {
      this.fieldIsEmpty = false
      if (this.group_by === 'section_id' && this.clause_id === '') {
        this.fieldIsEmpty = true
      } else if (this.group_by === 'assignee_id' && this.assignee_id === '') {
        this.fieldIsEmpty = true
      }
    },
    setViewBy() {
      if (this.group_by === 'clause_id') {
        this.clause_id = ''
      }
      if (this.group_by !== 'assignee_id') {
        this.assignee_id = ''
      }
      this.param.group_by = this.group_by
      this.param.clause_id = this.clause_id
      this.param.assignee_id = this.assignee_id
      this.showCharts = false
      setTimeout(() => {
        this.showCharts = true
      }, 10)
    },
    fetchClauses() {
      const fetchClausesResource = new Resource('ndpa/clauses')
      fetchClausesResource.list(this.query).then((response) => {
        this.clauses = response.clauses
      })
    },
    fetchClientUsers() {
      const fetchClausesResource = new Resource('clients/users')
      fetchClausesResource.list(this.query).then((response) => {
        this.clientUsers = response.users
      })
    },
    setModuleSlug() {
      let selectedProject = null
      this.load = true
      setTimeout(() => {
        this.clientActivatedProjects.forEach((project) => {
          if (project.available_module) {
            if (project.available_module.slug === 'ndpa') {
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
