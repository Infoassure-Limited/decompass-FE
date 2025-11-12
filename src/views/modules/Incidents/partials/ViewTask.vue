<template>
  <div v-loading="loading">
    <el-row v-if="task_details !== null" :gutter="10">
      <el-col :md="12">
        <el-select
          v-model="task_details.status"
          placeholder="Select User"
          value-key="id"
          filterable
          style="width: 100%"
          @change="taskActions(task_details.id, 'status', $event)"
        >
          <el-option
            v-for="(status, index) in statuses"
            :key="index"
            :value="status"
            :label="status"
          />
        </el-select>
      </el-col>
      <el-col :md="12">
        <div>
          <el-alert type="info" :closable="false">
            <strong>STATUS: {{ task_details.status.toUpperCase() }}</strong>
          </el-alert>
        </div>
      </el-col>
      <el-col v-loading="assigning" :md="12">
        <div align="right">
          <strong>Assigned To: </strong>
          <el-select
            v-model="task_details.assignee"
            placeholder="Select User"
            value-key="id"
            filterable
            style="width: 60%"
            @change="assignUser($event)"
          >
            <el-option
              v-for="(user, index) in clientUsers"
              :key="index"
              :value="user"
              :label="user.name"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="task_details !== null" :gutter="10">
      <el-col :md="24">
        <el-row :gutter="5">
          <el-col :md="24">
            <div>
              <v-text-field
                v-model="task_details.title"
                class="mb-2"
                label="Title"
                placeholder="Information Security Policy"
                variant="outlined"
                readonly
              />
            </div>
          </el-col>
          <el-col :md="24">
            <v-textarea
              v-model="task_details.description"
              class="mb-2"
              :rows="2"
              label="Description"
              placeholder="Briefly describe the incident"
              variant="outlined"
              readonly
            />
          </el-col>
        </el-row>
      </el-col>
      <el-col :md="24">
        <div
          style="
            max-height: 400px;
            overflow: auto;
            background: #f0f0f0;
            border-radius: 5px;
            padding: 20px;
          "
        >
          <IncidentEvidences :task="task_details" @uploaded="fetchTaskDetails" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import html2pdf from 'html2pdf.js'
import IncidentEvidences from './IncidentEvidences.vue'
import Resource from '@/api/resource'
export default {
  components: {
    IncidentEvidences
  },
  props: {
    selectedData: {
      type: Object,
      default: null
    },
    clientUsers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      versions: [],
      selectedVersion: null,
      showVersion: false,
      loading: false,
      loadVersions: false,
      updateLoader: false,
      showEdit: false,
      task_details: null,
      change_summary: '',
      statuses: ['Open', 'In Progress', 'Resolved', 'Closed']
    }
  },
  mounted() {
    this.fetchTaskDetails()
  },
  methods: {
    moment,
    fetchTaskDetails() {
      const fetchEntryResource = new Resource('isms/incidents/show-task')
      this.loading = true
      fetchEntryResource
        .get(this.selectedData.id)
        .then((response) => {
          this.task_details = response.task
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    assignUser(user) {
      this.$confirm(
        `Are you sure you want to assign this task to ${user.name} ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.assigning = true
          const assignUserResource = new Resource('isms/incidents/assign-user-to-task')
          assignUserResource
            .update(this.task_details.id, { assigned_to: user.id })
            .then((response) => {
              this.$message.success('User assigned successfully')
              this.task_details.assignee = user
              this.assigning = false
            })
            .catch((error) => {
              this.assigning = false
            })
        })
        .catch(() => {})
    },
    viewVersion(version) {
      this.selectedVersion = version
      this.showVersion = true
    },
    generatePdf(title, version) {
      const element = this.$refs.pdfContent.innerHTML
      const opt = {
        margin: 10,
        filename: `${title}-v${version}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }

      html2pdf().from(element).set(opt).save()
    },
    taskActions(incidentId, field, value) {
      if (window.confirm(`Click OK to confirm ${value} action`)) {
        const actionResource = new Resource(`isms/incidents/update-task-fields`)
        const form = { field, value }
        this.loading = true
        actionResource
          .update(incidentId, form)
          .then((response) => {
            this.loading = false
            this.$message(`Action Successful`)
            this.fetchTaskDetails()
          })
          .catch((error) => {
            this.$message({
              message: error,
              type: 'danger'
            })

            this.loading = false
          })
      }
    }
  }
}
</script>
<style scoped>
.pdf-container {
  position: relative;
}
.watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  font-size: 10em;
  color: rgba(0, 0, 0, 0.1);
  user-select: none;
  pointer-events: none;
}
</style>
