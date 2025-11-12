<template>
  <el-button type="text" @click="loadTaskLogs()"><icon icon="tabler:reload" /> Reload</el-button>
  <el-skeleton :loading="loader" :rows="1" :count="4" animated />
  <div v-if="!loader" style="height: 500px; overflow: auto">
    <el-collapse accordion expand-icon-position="left">
      <el-collapse-item
        v-for="(log, index) in task_logs"
        :key="index"
        :disabled="today_date < log.start_date"
      >
        <template #title>
          <strong>{{ log.recurrence_tag }}</strong>
          <div class="pull-right">
            <small>
              {{
                `Timeline: ${moment(log.start_date).format('ddd ll')} - ${moment(log.deadline).format('ddd ll')}`
              }}
            </small>
          </div>
        </template>
        <el-card>
          <AssignedTaskNotes
            :assignee-id="task.assignee_id"
            :task-log="log"
            :selected-module="selectedModule"
            @saved="loadTaskLogs"
          />
        </el-card>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
import AssignedTaskNotes from './AssignedTaskNotes.vue'

export default {
  components: {
    AssignedTaskNotes
  },
  props: {
    selectedModule: {
      type: String,
      required: true
    },
    task: {
      type: Object,
      default: () => null
    },
    occurence: {
      type: String,
      default: () => 'Annually'
    }
  },
  data() {
    return {
      loader: false,
      task_logs: [],
      today_date: null,
      form: {
        title: ''
      }
    }
  },
  mounted() {
    // this.fetchUploadedEvidiences()
    this.loadTaskLogs()
  },
  methods: {
    moment,
    disabledDate(time) {
      return time.getTime() <= Date.now() - 8.64e7 // Disable past dates
    },
    loadTaskLogs() {
      this.loader = true
      this.showEditor = false
      const evidenceResource = new Resource(`${this.selectedModule}/calendar/fetch-task-logs`)
      evidenceResource
        .list({ assigned_task_id: this.task.id })
        .then((response) => {
          this.task_logs = response.task_logs
          this.today_date = response.today_date
          this.loader = false
        })
        .catch((error) => {
          this.loader = false
          console.log(error.response.data.message)
        })
    },
    isTaskCompleted() {
      if (this.uploads.length > 0) {
        let uncompleteUpload = 0
        this.uploads.forEach((upload) => {
          if (upload.link === null) {
            uncompleteUpload = 1
          }
        })
        if (uncompleteUpload > 0) {
          return false
        }
        return true
      }
      return true
    },
    statusColor(status) {
      if (status === 'completed' || status === 'submitted') {
        return 'success'
      }
      if (status === 'in progress') {
        return 'warning'
      }
      return 'error'
    }
  }
}
</script>
