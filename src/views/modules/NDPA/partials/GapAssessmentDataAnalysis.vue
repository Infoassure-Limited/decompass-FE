<template>
  <el-row :gutter="8">
    <el-col
      v-for="(item, index) in statistics"
      :key="index"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="24"
      :xl="24"
    >
      <el-skeleton :loading="load" :rows="3" animated />
      <el-card
        v-if="item.show"
        style="border-top-left-radius: 1rem; border-bottom-right-radius: 1rem"
      >
        <el-card-body class="d-flex justify-content-between align-items-center">
          <el-avatar size="large">
            <icon size="35" :icon="item.icon" :color="item.color" />
          </el-avatar>
          <div class="truncate mb-5">
            <h2 class="font-weight-bolder">
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
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedClient: {
      type: Object,
      default: () => null
    },
    selectedProject: {
      type: Object,
      default: () => null
    },
    filterBy: {
      type: Object,
      default: () => ({
        group_by: 'clause_id',
        clause_id: '',
        assignee_id: '',
        date: ''
      })
    }
  },
  data() {
    return {
      showAnalysis: false,
      statistics: [],
      dashboardData: {},
      evidence: '',
      load: false
    }
  },
  watch: {
    selectedProject() {
      this.fetchAnalystics()
    }
  },
  mounted() {
    this.fetchAnalystics()
  },
  methods: {
    setData() {
      const data = [
        {
          color: 'green',
          icon: 'tabler:help',
          statistic: this.dashboardData.all_questions,
          label: 'Questions',
          title2: 'Responses',
          statistic2: this.dashboardData.answered_questions,
          footer: true,
          show: true
        },
        {
          color: 'blue',
          icon: 'tabler:upload',
          statistic: this.dashboardData.expected_documents,
          label: 'Expected Documents',
          title2: 'Uploaded Documents',
          statistic2: this.dashboardData.uploaded_documents,
          footer: true,
          show: this.selectedProject.allow_document_uploads === 1
        },
        {
          color: 'red',
          icon: 'tabler:alert-triangle',
          statistic: this.dashboardData.exceptions,
          label: 'EXCLUSIONS',
          show: true
        }
      ]
      this.statistics = data
    },
    fetchAnalystics() {
      this.load = true
      const param = {
        project_id: this.selectedProject.id,
        client_id: this.selectedClient.id,
        group_by: this.filterBy.group_by,
        clause_id: this.filterBy.clause_id,
        assignee_id: this.filterBy.assignee_id,
        date: this.filterBy.date
      }
      const dashboardDataResource = new Resource('ndpa/reports/client-project-data-analysis')
      dashboardDataResource
        .list(param)
        .then((response) => {
          this.dashboardData = response
          this.setData()
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
