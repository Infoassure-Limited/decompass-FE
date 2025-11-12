<template>
  <div>
    <!-- <div slot="header">
      <span class="pull-right">
        <el-button
          v-if="!showAnalysis"
          variant="outline-success"
          size="sm"
          @click="showAnalysis = true"
        >Show Analysis</el-button>
        <el-button
          v-else
          variant="outline-danger"
          size="sm"
          @click="showAnalysis = false"
        >Hide Analysis</el-button>
      </span>
      <h4>Manage Gap Assessment</h4>
    </div> -->
    <div v-if="showAnalysis">
      <el-row :gutter="8">
        <el-col
          v-for="(item, index) in statistics"
          :key="index"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="8"
          :xl="8"
        >
          <el-card
            v-if="item.show"
            style="border-top-left-radius: 1rem; border-bottom-right-radius: 1rem"
          >
            <el-card-body class="d-flex justify-content-between align-items-center">
              <el-avatar :variant="`light-${item.color}`" size="50">
                <feather-icon size="40" :icon="item.icon" />
              </el-avatar>
              <div class="truncate">
                <h2 class="mel-25 font-weight-bolder">
                  {{ item.statistic }}
                </h2>
                <span>{{ item.label }}</span>
              </div>
            </el-card-body>
            <el-card-footer>
              <strong>
                <span v-if="item.footer">{{ item.title2 }}: {{ item.statistic2 }}</span>
                <span v-else>&nbsp;</span>
              </strong>
            </el-card-footer>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-card>
      <el-tabs variant="danger">
        <el-tab title="AUDIT QUESTIONS" lazy>
          <audit-questions
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </el-tab>
        <el-tab v-if="selectedProject.allow_document_uploads === 1" title="DOCUMENTS" lazy>
          <documents
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </el-tab>
        <el-tab title="EXCLUSIONS" lazy>
          <exceptions
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </el-tab>
        <!-- <el-tab
        title="CERTIFICATE"
        lazy
      >
        <certificate
          :selected-project="selectedProject"
          :is-admin="isAdmin"
          @reloadAnalytics="fetchAnalystics"
        />
      </el-tab> -->
        <el-tab v-if="isAdmin" title="ASSESSMENT REPORTS" lazy>
          <reports
            :selected-project="selectedProject"
            :is-admin="isAdmin"
            @reloadAnalytics="fetchAnalystics"
          />
        </el-tab>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import AuditQuestions from './AuditQuestions.vue'
import Exceptions from './Exceptions.vue'
// import Certificate from './Certificate.vue'
import Reports from './Reports.vue'

import Resource from '@/api/resource'

export default {
  components: {
    Documents,
    AuditQuestions,
    Exceptions,
    // Certificate,
    Reports
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => ({})
    },
    selectedProject: {
      type: Object,
      default: () => ({})
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      showAnalysis: true,
      statistics: [],
      dashboardData: {},
      evidence: ''
    }
  },
  watch: {
    selectedClient() {
      this.createProjectAnswers()
      this.createProjectUploads()
    },
    selectedProject() {
      this.createProjectAnswers()
      this.createProjectUploads()
    }
  },
  created() {
    this.createProjectAnswers()
    this.createProjectUploads()
  },
  methods: {
    setData() {
      const data = [
        {
          color: 'success',
          icon: 'HelpCircleIcon',
          statistic: this.dashboardData.all_questions,
          label: 'Questions',
          title2: 'Responses',
          statistic2: this.dashboardData.answered_questions,
          footer: true,
          show: true
        },
        {
          color: 'primary',
          icon: 'UploadIcon',
          statistic: this.dashboardData.expected_documents,
          label: 'Expected Documents',
          title2: 'Uploaded Documents',
          statistic2: this.dashboardData.uploaded_documents,
          footer: true,
          show: this.selectedProject.allow_document_uploads === 1
        },
        {
          color: 'danger',
          icon: 'AlertCircleIcon',
          statistic: this.dashboardData.exceptions,
          label: 'EXCLUSIONS',
          show: true
        }
      ]
      this.statistics = data
    },
    createProjectAnswers() {
      const param = {
        project_id: this.selectedProject.id,
        consulting_id: this.selectedProject.consulting_id,
        client_id: this.selectedProject.client_id,
        standard_id: this.selectedProject.standard_id
      }
      this.loading = true
      const createAnswersResource = new Resource('answers/save')
      createAnswersResource.store(param).then(() => {
        this.fetchAnalystics()
      })
    },
    createProjectUploads() {
      const param = {
        project_id: this.selectedProject.id,
        consulting_id: this.selectedProject.consulting_id,
        client_id: this.selectedProject.client_id,
        standard_id: this.selectedProject.standard_id
      }
      this.loading = true
      const createUploadsResource = new Resource('clauses/uploads/save')
      createUploadsResource.store(param).then(() => {
        this.fetchAnalystics()
      })
    },
    fetchAnalystics() {
      const param = {
        project_id: this.selectedProject.id,
        client_id: this.selectedProject.client_id
      }
      const dashboardDataResource = new Resource('reports/client-project-data-analysis')
      dashboardDataResource
        .list(param)
        .then((response) => {
          this.dashboardData = response
          this.setData()
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    }
  }
}
</script>
