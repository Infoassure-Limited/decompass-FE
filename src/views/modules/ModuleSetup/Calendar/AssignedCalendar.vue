<template>
  <div v-loading="loading" element-loading-text="loading data, please wait...">
    <el-tooltip content="Refresh">
      <el-button @click="fetchAssignedTasks()">
        <icon icon="tabler:reload" />
      </el-button>
    </el-tooltip>
    <el-table :data="assigned_tasks" height="500" style="width: 100%">
      <el-table-column fixed prop="task.name" label="Task" width="350" />
      <el-table-column v-if="selectedModule !== 'ndpa'" prop="task.clause.name" label="Clause" />
      <el-table-column v-if="selectedModule === 'ndpa'" label="Requirement" width="150">
        <template #default="scope">
          <span>{{ scope.row.task.clause.name }}</span>
          <br />
          <small>{{ scope.row.task.section.name }}</small>
        </template>
      </el-table-column>
      <el-table-column label="Uploaded Evidences" width="150">
        <template #default="scope">
          <strong>{{
            `${calculateUploadedEvidences(scope.row.task.expected_task_evidences)} of ${scope.row.task.expected_task_evidences.length}`
          }}</strong>
          <el-progress
            :percentage="calculateProgress(scope.row.task.expected_task_evidences)"
            :color="calculateStatus(scope.row.task.expected_task_evidences)"
          />
        </template>
      </el-table-column>
      <el-table-column label="Status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 'completed'" effect="dark" type="success">
            Closed
          </el-tag>
          <el-tag v-else-if="scope.row.status === 'in progress'" type="warning"> Open </el-tag>
          <el-tag v-else effect="dark" type="danger"> Overdue </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Responsible" width="150">
        <template #default="scope">
          <span>{{ scope.row.assignee !== null ? scope.row.assignee.name : 'Not Assgined' }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="Action" width="200">
        <template #default="scope">
          <el-button-group>
            <el-tooltip content="View Task Details">
              <el-button @click="showTaskDetails(scope.row)">
                <icon icon="tabler:file-description" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
      v-if="modalShow"
      v-model="modalShow"
      direction="rtl"
      size="87%"
      @close="fetchAssignedTasks(false)"
    >
      <template #header>
        <span>Task Details</span>
      </template>
      <el-card>
        <AssignTaskTable
          :selected-data="selectedData"
          :selected-module="selectedModule"
          :staff="staff"
          @update:tasks="updateTask"
        />
      </el-card>
    </el-drawer>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import AssignTaskTable from '@/views/modules/ModuleSetup/Calendar/partials/AssignTaskTable.vue'

export default {
  components: {
    AssignTaskTable
  },
  props: {
    selectedModule: {
      type: String,
      default: () => 'isms'
    }
  },
  data() {
    return {
      showCreateActivityModal: false,
      showCreateTaskModal: false,
      showAssignModal: false,
      showMenu: true,
      asset_types: [],
      assigned_tasks: [],
      selectedData: null,
      loading: false,
      inputVisible: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      isCreateNew: false,
      impacts: [],
      likelihoods: [],
      risk_appetite: null,
      risk_assessments: [],
      loadView: false,
      modalShow: false,
      response: {},
      activatedModules: [],
      selectedActivity: null,
      staff: [],
      assignForm: {
        module_activity_task_id: '',
        assignee_id: '',
        start_date: new Date(),
        end_date: new Date(),
        recurrence: null
      },
      empty_form: {
        module_activity_task_id: '',
        assignee_id: '',
        start_date: new Date(),
        end_date: new Date(),
        recurrence: null
      }
    }
  },
  computed: {},
  mounted() {
    this.fetchAssignedTasks()
  },
  methods: {
    calculateProgress(expected_task_evidences) {
      const totalExpectedEvidences = expected_task_evidences.length
      let uploadedEvidences = 0
      expected_task_evidences.forEach((evidence) => {
        if (evidence.upload.link !== null) {
          uploadedEvidences++
        }
      })
      const uploadPercentage = (uploadedEvidences / totalExpectedEvidences) * 100
      return uploadPercentage.toFixed(0)
    },
    calculateUploadedEvidences(expected_task_evidences) {
      const totalExpectedEvidences = expected_task_evidences.length
      let uploadedEvidences = 0
      expected_task_evidences.forEach((evidence) => {
        if (evidence.upload.link !== null) {
          uploadedEvidences++
        }
      })
      return uploadedEvidences
    },
    calculateStatus(expected_task_evidences) {
      const totalExpectedEvidences = expected_task_evidences.length
      let uploadedEvidences = 0
      expected_task_evidences.forEach((evidence) => {
        if (evidence.upload.link !== null) {
          uploadedEvidences++
        }
      })
      const uploadPercentage = parseInt((uploadedEvidences / totalExpectedEvidences) * 100)
      if (uploadPercentage >= 100) {
        return '#198754'
      } else if (uploadPercentage <= 99 && uploadPercentage >= 70) {
        return '#20c997'
      } else if (uploadPercentage <= 69 && uploadPercentage >= 50) {
        return '#ffc107'
      } else {
        return '#dc3545'
      }
    },
    showTaskDetails(data) {
      this.selectedData = data
      this.modalShow = true
    },
    updateTask(task) {
      this.selectedData.assigned_task = task
    },
    fetchAssignedTasks(load = true) {
      this.showCreateActivityModal = false
      this.showCreateTaskModal = false
      this.loading = load
      const fetchResource = new Resource(
        `${this.selectedModule}/calendar/fetch-user-assigned-tasks`
      )
      fetchResource
        .list()
        .then((response) => {
          this.assigned_tasks = response.assigned_tasks
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    viewDetails(data) {
      if (data.id) {
        this.loadView = true
        this.viewType = ''
        setTimeout(() => {
          this.selectedData = data
          this.viewType = 'edit'
          this.showMenu = false
          this.loadView = false
        }, 100)
      }
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
