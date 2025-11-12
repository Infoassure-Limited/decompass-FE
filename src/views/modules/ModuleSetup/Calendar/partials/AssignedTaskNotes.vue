<template>
  <div v-loading="loader">
    <div v-if="userData.id === assigneeId">
      <v-textarea
        v-model="form.notes"
        variant="outlined"
        placeholder="Drop a note in response to task here..."
        label="Notes/Response to task"
      />

      <el-button-group>
        <el-button type="primary" @click="saveNote()">
          <icon icon="tabler:device-floppy" /> Save Note
        </el-button>
        <!-- <el-button
        type="success"
        :disabled="taskLog.notes === null"
        @click="markTaskAsDone(taskLog.id)"
      >
        <icon icon="tabler:check" /> Mark as completed
      </el-button> -->
      </el-button-group>
    </div>
    <div v-else>
      <aside>
        {{ form.notes !== null ? form.notes : 'No action on the task yet' }}
      </aside>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
// import { Editor } from '@/components/Editor'

export default {
  components: {
    // Editor
  },
  props: {
    assigneeId: {
      type: Number,
      default: () => null
    },
    taskLog: {
      type: Object,
      default: () => null
    },
    selectedModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loader: false,
      form: {
        notes: ''
      }
    }
  },
  computed: {
    userData() {
      return this.$store.getters.userData
    }
  },
  watch: {
    taskLog() {
      this.form = this.taskLog
    }
  },
  beforeMount() {
    this.form.notes = this.taskLog.notes
  },
  methods: {
    saveNote() {
      const createTaskResource = new Resource(
        `${this.selectedModule}/calendar/save-assigned-task-note`
      )
      const { form } = this
      form.id = this.taskLog.id
      this.loader = true
      createTaskResource
        .update(this.taskLog.id, form)
        .then((response) => {
          this.$message('Successful')
          this.$emit('saved')
          this.loader = false
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    },
    markTaskAsDone(taskId) {
      if (!this.isTaskCompleted()) {
        this.$alert('Please ensure all required documents/evidences are uploaded')
        return false
      }
      if (confirm('Click OK to mark this task as completed?')) {
        this.loader = true
        const fetchResource = new Resource(`${this.selectedModule}/calendar/mark-task-as-completed`)
        fetchResource
          .update(taskId)
          .then((response) => {
            this.$message.success('Task marked as completed successfully')
            this.loadTaskLogs()
            this.loader = false
            this.fetchProjectCalendarData() // Refresh the calendar data after marking as done
          })
          .catch(() => {
            console.error('Failed to mark task as done')
          })
      }
    }
  }
}
</script>
