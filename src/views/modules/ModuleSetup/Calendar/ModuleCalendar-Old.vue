<template>
  <el-container style="height: 100%">
    <el-aside
      v-loading="loading"
      element-loading-text="loading resources, please wait..."
      width="350px"
    >
      <el-tabs type="border-card" stretch lazy>
        <el-tab-pane v-for="(clauses, index) in clause_tasks" :key="index" :label="index">
          <div style="max-height: 800px; overflow: auto">
            <el-collapse expand-icon-position="left">
              <el-collapse-item v-for="(clause, clause_index) in clauses" :key="clause_index">
                <template v-if="selectedModule === 'ndpa'" #title>
                  <strong>{{ clause.name }}</strong> {{ clause.section_name }}
                </template>
                <template v-else #title>
                  <strong>{{ clause.name }}</strong> {{ clause.description }}
                </template>
                <div v-for="(task, task_index) in clause.tasks" :key="task_index">
                  <CardNavView
                    v-if="selectedModule === 'ndpa'"
                    :id="`task-${index}-${task.id}`"
                    :title="`Process ${task.activity_no}`"
                    title-icon="tabler:arrow-badge-right"
                    @clickToView="viewDetails(task)"
                  >
                    <template #description>
                      <div>
                        <em>{{ task.name }}</em>
                      </div>
                    </template>
                  </CardNavView>
                  <CardNavView
                    v-else
                    :id="`task-${index}-${task.id}`"
                    :title="`Process ${task.activity_no}`"
                    title-icon="tabler:arrow-badge-right"
                    @clickToView="viewDetails(task)"
                  >
                    <template #description>
                      <div>
                        <em>{{ task.name }}</em>
                      </div>
                    </template>
                  </CardNavView>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
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
          <p>Click on any task under any control</p>
        </div>
      </el-main>
    </el-container>
  </el-container>
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
  props: {
    selectedModule: {
      type: String,
      required: true
    }
  },
  data() {
    return {
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
      const fetchResource = new Resource(
        `${this.selectedModule}/calendar/fetch-client-assigned-tasks`
      )
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
