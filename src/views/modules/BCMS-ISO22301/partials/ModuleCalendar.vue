<template>
  <el-tabs
    v-loading="loading"
    element-loading-text="loading resources, please wait..."
    type="border-card"
    stretch
    lazy
  >
    <el-tab-pane v-for="(tasks, index) in clause_tasks" :key="index" :label="index">
      <p>Click to view task details</p>
      <el-container style="height: 100%">
        <el-aside width="350px">
          <div style="height: 800px; overflow: auto">
            <div v-for="(task, task_index) in tasks" :key="task_index">
              <CardNavView
                :id="`task-${index}-${task.id}`"
                :title="`${task.clause.name} ~ ${task.activity_no} `"
                @click="viewDetails(task)"
              >
                <template #description>
                  <div>
                    <em> <icon icon="tabler:arrow-badge-right" /> {{ task.name }}</em>
                    <br />
                    <div v-if="task.assigned_task === null">
                      <small>
                        <icon icon="tabler:calendar-x" size="20" />
                        Not Assigned
                      </small>
                    </div>
                    <div v-else>
                      <small v-if="task.assigned_task.status === 'overdue'">
                        <icon icon="tabler:exclamation-circle-filled" color="red" size="20" />
                        Overdue
                      </small>
                      <small v-if="task.assigned_task.status === 'in progress'">
                        <icon icon="tabler:exclamation-circle-filled" color="orange" size="20" />
                        In Progress
                      </small>
                      <small
                        v-if="
                          task.assigned_task.status === 'completed' ||
                          task.assigned_task.status === 'submitted'
                        "
                      >
                        <icon icon="tabler:circle-check-filled" color="green" size="20" />
                        {{ task.assigned_task.status }}
                      </small>
                    </div>
                  </div>
                </template>
              </CardNavView>
            </div>
          </div>
        </el-aside>

        <el-container>
          <el-main v-loading="loadView" element-loading-text="loading data, please wait...">
            <div v-if="viewType === 'edit'">
              <AssignTaskTable
                :selected-data="selectedData"
                :selected-module="selectedModule"
                :staff="staff"
                role="admin"
                @update:tasks="updateTask"
              />
            </div>
            <div v-if="viewType === 'welcome'" align="center">
              <icon icon="tabler:calendar-time" size="200" />
              <h3>View and assign tasks to team members here</h3>
              <p>Click on any activity under any control</p>
            </div>
          </el-main>
        </el-container>
      </el-container>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Resource from '@/api/resource'
import AssignTaskTable from '@/views/modules/ModuleSetup/Calendar/partials/AssignTaskTable.vue'
import CardNavView from '@/views/Components/CardNavView.vue'

export default {
  components: {
    AssignTaskTable,
    CardNavView
  },
  props: {},
  data() {
    return {
      selectedModule: 'bcms',
      showCreateActivityModal: false,
      showCreateTaskModal: false,
      showMenu: true,
      asset_types: [],
      clause_tasks: [],
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
      viewType: 'welcome',
      response: {},
      activatedModules: [],
      selectedActivity: null,
      staff: []
    }
  },
  computed: {},
  mounted() {
    this.fetchTaskByClause()
    this.fetchStaff()
  },
  methods: {
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
      const fetchResource = new Resource('bcms/calendar/fetch-client-assigned-tasks')
      fetchResource
        .list()
        .then((response) => {
          this.clause_tasks = response.clause_tasks
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
