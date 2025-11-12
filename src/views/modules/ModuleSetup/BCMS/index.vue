<template>
  <el-card>
    <template v-slot:header>
      <div>
        <!-- <span class="pull-right">
          <el-button type="primary" @click="viewType = 'tabular'"
            ><icon icon="tabler:table" />&nbsp;Summary</el-button
          >
        </span> -->
        <h3>Clause Activities & Task Setup</h3>
      </div>
    </template>
    <el-container style="height: 100%">
      <el-aside
        v-loading="loading"
        element-loading-text="loading resources, please wait..."
        width="400px"
      >
        <v-btn color="orange" block @click="showCreateTaskModal = true">
          <icon icon="tabler:plus" />&nbsp;New Task
        </v-btn>
        <div style="max-height: 700px; overflow: auto; padding: 10px">
          <el-collapse>
            <el-collapse-item
              v-for="(clause, index) in clause_tasks"
              :key="index"
              :name="`${index}`"
            >
              <template #title>
                <h3>{{ clause.name }}</h3>
              </template>
              <div>
                <!-- <v-btn color="error" block @click="createTask(activity)">
                  <icon icon="tabler:plus" />&nbsp;New Task
                </v-btn>
                <br /> -->
                <div v-for="(task, task_index) in clause.tasks" :key="task_index">
                  <CardNavView
                    :id="`task-${index}-${activity_index}-${task_index}`"
                    :title="`${task.activity_no} - ${task.name}`"
                    title-icon="tabler:arrow-badge-right"
                    @clickToView="viewDetails(task)"
                  >
                    <template #description>
                      <div>
                        <span v-html="task.description"></span>
                      </div>
                    </template>
                  </CardNavView>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-aside>

      <el-container>
        <el-main v-loading="loadView" element-loading-text="loading data, please wait...">
          <div v-if="viewType === 'edit'">
            <EditTask :selected-data="selectedData" />
          </div>
          <div v-if="viewType === 'welcome'" align="center">
            <icon icon="tabler:settings-cog" size="200" />
            <h3>Manage the activities & tasks for ISMS Controls here</h3>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <el-dialog
      v-if="showCreateTaskModal"
      v-model="showCreateTaskModal"
      title="Create Tasks"
      width="80%"
    >
      <CreateTasks :clauses="clause_tasks" @saved="fetchTaskByClause" />
    </el-dialog>
    <!-- <el-dialog
      v-if="showCreateTaskModal"
      v-model="showCreateTaskModal"
      :title="`Create Tasks under control ${selectedActivity.activity_no} (${selectedActivity.name})`"
      width="80%"
    >
      <CreateTasks :activity="selectedActivity" @saved="fetchTaskByClause" />
    </el-dialog> -->
  </el-card>
</template>
<script>
import CardNavView from '@/views/Components/CardNavView.vue'
// import CreateActivities from './partials/CreateActivities.vue'
import CreateTasks from './partials/CreateTasks.vue'
import EditTask from './partials/EditTask.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // CreateActivities,
    CardNavView,
    CreateTasks,
    EditTask
  },
  props: {},
  data() {
    return {
      showCreateTaskModal: false,
      // showCreateTaskModal: false,
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
      selectedActivity: null
    }
  },
  computed: {},
  mounted() {
    this.fetchTaskByClause()
  },
  methods: {
    createTask(activity) {
      this.selectedActivity = activity
      this.showCreateTaskModal = true
    },
    fetchTaskByClause(load = true) {
      this.showCreateTaskModal = false
      this.showCreateTaskModal = false
      this.loading = load
      const fetchResource = new Resource('bcms/calendar/fetch-task-by-clause')
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
