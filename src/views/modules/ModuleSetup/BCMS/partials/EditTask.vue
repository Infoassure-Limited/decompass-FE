<template>
  <el-tabs type="border-card" class="demo-tabs">
    <el-tab-pane label="Manage Task">
      <el-row :gutter="20">
        <el-col :md="24">
          <div>
            <br />
            <v-text-field variant="outlined" v-model="taskForm.name" label="Task" />
            <v-textarea variant="outlined" v-model="taskForm.description" label="Description" />
            <v-text-field
              variant="outlined"
              v-model="taskForm.implementation_guide"
              label="Implementation Guide"
            />
            <label for="">Expected Document/Evidence Template</label>
            <el-select
              v-model="taskForm.document_template_ids"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="Select"
              style="width: 100%"
              filterable
            >
              <el-option-group
                v-for="(documentTemplates, index) in templates"
                :key="index"
                :label="index"
              >
                <el-option
                  v-for="template in documentTemplates"
                  :key="template.id"
                  :label="template.title"
                  :value="template.id"
                />
              </el-option-group>
            </el-select>
            <label for="">Dependency <em>(Which other task does this depend on?)</em></label>
            <el-select v-model="taskForm.dependency" filterable style="width: 100%">
              <el-option
                v-for="(task, index) in other_tasks"
                :key="index"
                :disabled="task.id === taskForm.id"
                :value="task.id"
                :label="`${task.activity_no} - ${task.name}`"
              >
                <!-- <span style="float: left">{{ `${task.activity_no} - ${task.name}` }}</span>
                <span style="float: right; color: var(--el-text-color-secondary); font-size: 11px">
                  {{ task.name }}
                </span> -->
              </el-option>
            </el-select>
            <label for="">Priority</label>
            <el-select v-model="taskForm.priority" style="width: 100%">
              <el-option
                v-for="(priority, index) in [
                  { id: 'low', name: 'Low' },
                  { id: 'medium', name: 'Medium' },
                  { id: 'high', name: 'High' }
                ]"
                :key="index"
                :value="priority.id"
                :label="priority.name"
              />
            </el-select>
            <label for="">Occurence</label>
            <el-select v-model="taskForm.occurence" style="width: 100%">
              <el-option
                v-for="(occurence, index) in [
                  { id: 'weekly', name: 'Weekly' },
                  { id: 'monthly', name: 'Monthly' },
                  { id: 'quarterly', name: 'Quarterly' },
                  { id: 'biannually', name: 'Biannually' },
                  { id: 'annually', name: 'Annually' }
                ]"
                :key="index"
                :value="occurence.id"
                :label="occurence.name"
              />
            </el-select>
            <v-btn :loading="updateTaskLoader" color="black" @click="updateTask()">
              <icon icon="tabler:edit" />&nbsp;Update Task
            </v-btn>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane>
    <!-- <el-tab-pane label="Manage Activity">
      <el-row :gutter="20">
        <el-col :md="24">
          <div style="max-height: 550px; overflow: auto">
            <br />
            <v-text-field
              variant="outlined"
              id="name"
              v-model="activityForm.activity_no"
              label="Control No."
            />
            <v-text-field
              variant="outlined"
              id="name"
              v-model="activityForm.name"
              label="Activity Name/Title"
            />
            <v-textarea
              variant="outlined"
              id="name"
              v-model="activityForm.description"
              label="Description"
            />
            <v-btn :loading="updateActivityLoader" color="orange" @click="updateActivity()">
              <icon icon="tabler:edit" />&nbsp;Update Activity
            </v-btn>
          </div>
        </el-col>
      </el-row>
    </el-tab-pane> -->
  </el-tabs>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedData: {
      type: Object,
      default: () => null
    },
    selectedActivity: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      updateActivityLoader: false,
      updateTaskLoader: false,
      loader: false,
      details: [],
      fill_fields_error: false,
      loadTasks: false,
      other_tasks: [],
      activityForm: {
        id: '',
        activity_no: '',
        name: '',
        description: ''
      },
      taskForm: {
        id: '',
        activity_no: '',
        document_template_ids: '',
        implementation_guide: '',
        name: '',
        description: '',
        dependency: null
      },
      templates: []
    }
  },
  mounted() {
    this.fetchDocumentTemplates()
    this.fetchAllTasks()
    if (this.selectedData) {
      this.taskForm = this.selectedData
    }
    // if (this.selectedActivity) {
    //   this.activityForm.id = this.selectedActivity.id
    //   this.activityForm.activity_no = this.selectedActivity.activity_no
    //   this.activityForm.name = this.selectedActivity.name
    //   this.activityForm.description = this.selectedActivity.description
    // }
  },
  methods: {
    fetchDocumentTemplates() {
      const fetchTemplateResource = new Resource('document-templates/fetch')
      fetchTemplateResource.list(this.form).then((response) => {
        this.templates = response.document_templates
      })
    },
    fetchAllTasks() {
      this.loadTasks = true
      const fetchAllTasksesource = new Resource('bcms/calendar/fetch-all-tasks')
      fetchAllTasksesource
        .list()
        .then((response) => {
          this.loadTasks = false
          this.other_tasks = response.tasks
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loadTasks = false
        })
    },
    updateActivity() {
      this.updateActivityLoader = true
      const { activityForm } = this
      const updateActivityResource = new Resource('bcms/calendar/update-clause-activity')
      updateActivityResource
        .update(activityForm.id, activityForm)
        .then(() => {
          this.$message('Update Action Successful')
          this.updateActivityLoader = false
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.updateActivityLoader = false
        })
    },
    updateTask() {
      this.updateTaskLoader = true
      const { taskForm } = this
      const updateActivityResource = new Resource('bcms/calendar/update-clause-activity-task')
      updateActivityResource
        .update(taskForm.id, taskForm)
        .then(() => {
          this.$message('Update Action Successful')
          this.updateTaskLoader = false
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.updateTaskLoader = false
        })
    }
  }
}
</script>
