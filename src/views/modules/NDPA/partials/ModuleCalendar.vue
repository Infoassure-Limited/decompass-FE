<template>
  <div v-loading="loading" element-loading-text="loading data, please wait...">
    <el-table :data="assigned_tasks" height="600" style="width: 100%">
      <el-table-column fixed prop="task.name" label="Task" width="400" />
      <el-table-column prop="task.clause.name" label="Part" />
      <el-table-column prop="task.section.name" label="Section" />
      <el-table-column prop="status" label="Status" />
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
            <el-tooltip content="Assign Task">
              <el-button @click="showAssignTaskModal(scope.row)">
                <icon icon="tabler:user-plus" color="brown" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Mark As Completed">
              <el-button @click="markTaskAsDone(scope.row.id)">
                <icon icon="tabler:check" color="green" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer v-if="modalShow" v-model="modalShow" direction="rtl" size="87%">
      <template #header>
        <span>Task Details</span>
      </template>
      <el-card>
        <AssignTaskTable
          :selected-data="selectedData"
          :selected-module="selectedModule"
          :staff="staff"
          role="admin"
          @update:tasks="updateTask"
        />
      </el-card>
    </el-drawer>
    <el-dialog
      v-if="showAssignModal"
      v-model="showAssignModal"
      hide-footer
      width="50%"
      centered
      title="Assign Task"
    >
      <el-row v-loading="loading" :gutter="20">
        <el-col :md="24">
          <label for="">Select Assignee</label>
          <el-select
            v-model="assignForm.assignee_id"
            placeholder="Select Assignee"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(user, user_index) in staff"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            >
              <span style="float: left">{{ user.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                user.designation ? user.designation : ''
              }}</span>
            </el-option>
          </el-select>
        </el-col>
        <el-col :md="12">
          <label for="">Set Start Date</label>
          <el-date-picker
            v-model="assignForm.start_date"
            type="date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </el-col>
        <el-col :md="12">
          <label for="">Set End Date</label>
          <el-date-picker
            v-model="assignForm.end_date"
            type="date"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            placeholder="Pick a date"
            style="width: 100%"
            @change="fetchProjects"
          />
        </el-col>
        <el-col :md="24">
          <label for="">How often will the task be performed?</label>
          <el-radio-group v-model="assignForm.recurrence" fill="#343a40">
            <el-radio-button label="Weekly" value="Weekly" />
            <el-radio-button label="Monthly" value="Monthly" />
            <el-radio-button label="Quarterly" value="Quarterly" />
            <el-radio-button label="Biannually" value="Biannually" />
            <el-radio-button label="Annually" value="Annually" />
            <el-radio-button label="Adhoc" value="Adhoc" />
          </el-radio-group>
        </el-col>
        <el-col :md="24">
          <hr />
          <el-button :loading="loader" type="primary" @click="assignTask()">
            <span class="align-middle">Assign</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import Resource from '@/api/resource'
import AssignTaskTable from '@/views/modules/ModuleSetup/Calendar/partials/AssignTaskTable.vue'

export default {
  components: {
    AssignTaskTable
  },
  props: {},
  data() {
    return {
      selectedModule: 'ndpa',
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
    this.fetchTaskByClause()
    this.fetchStaff()
  },
  methods: {
    markTaskAsDone(taskId) {
      if (confirm('Click OK to mark this task as completed?')) {
        this.loader = true
        const fetchResource = new Resource(`${this.selectedModule}/calendar/mark-task-as-done`)
        fetchResource
          .update(taskId)
          .then((response) => {
            this.fetchTaskByClause()
            this.$message.success('Task marked as completed successfully')
            this.loader = false
          })
          .catch((error) => {
            this.$message.error(error.response.data.message)
          })
      }
      // Logic to mark the task as done
    },
    assignTask() {
      const createTaskResource = new Resource(`${this.selectedModule}/calendar/assign-task-to-user`)
      const { assignForm } = this
      this.loader = true
      createTaskResource
        .store(assignForm)
        .then((response) => {
          this.assignForm = this.empty_form
          this.fetchTaskByClause()
          this.showAssignModal = false
          this.loader = false

          this.$message('Task Assigned Successfully')
          // send mail
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loader = false
        })
    },
    showAssignTaskModal(data) {
      this.assignForm.module_activity_task_id = data.module_activity_task_id
      this.showAssignModal = true
    },
    showTaskDetails(data) {
      this.selectedData = data
      this.modalShow = true
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    updateTask(task) {
      this.selectedData.assigned_task = task
    },
    fetchTaskByClause(load = true) {
      this.showCreateActivityModal = false
      this.showCreateTaskModal = false
      this.loading = load
      const fetchResource = new Resource(
        `${this.selectedModule}/calendar/fetch-client-assigned-tasks`
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
