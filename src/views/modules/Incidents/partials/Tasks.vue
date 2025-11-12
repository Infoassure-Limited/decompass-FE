<!-- eslint-disable vue/html-indent -->
<template>
  <el-card>
    <template v-slot:header>
      <div>
        <span class="pull-right">
          <el-button type="primary" @click="showModal = true">
            <icon icon="tabler:plus" />&nbsp;Create New Task
          </el-button>
        </span>
        <h3>Incident Resolution Tasks</h3>
      </div>
    </template>
    <el-container style="height: 100%">
      <el-aside
        v-loading="loading"
        element-loading-text="loading assessment, please wait..."
        width="320px"
      >
        <div v-if="tasks.length > 0">
          <h4>Tasks</h4>
          <el-card
            v-for="(task, tasks_index) in tasks"
            :key="tasks_index"
            :id="`asset-${index}-${tasks_index}`"
            @click="viewDetails(task, `asset-${index}-${tasks_index}`)"
            style="cursor: pointer; margin-bottom: 5px"
            shadow="hover"
          >
            <strong>{{ `#${tasks_index + 1}` }} {{ task.title }}</strong>
            <!-- <div>
              <small>
                <em> <strong>Description: </strong></em>
                <span v-html="task.description"></span>
              </small>
            </div> -->
          </el-card>
        </div>
        <div v-if="!loading && tasks.length < 1" align="center">
          <el-empty description="No task is created" />
          <el-button type="primary" @click="showModal = true">
            <icon icon="tabler:plus" />&nbsp;Create
          </el-button>
        </div>
      </el-aside>

      <el-container>
        <el-main v-loading="loadView">
          <div v-if="viewType === 'edit'">
            <ViewTask
              :selected-data="selectedData"
              :client-users="clientUsers"
              @updated="renderViewAgain"
            />
          </div>
          <div v-if="viewType === 'welcome'" align="center">
            <img src="/images/project-icons/assessment.png" width="250" />
            <h3>Manage and Treat Tasks</h3>
            <span align="center">
              <p>Use the navigation to perform your assessment </p>
            </span>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog v-model="showModal" title="Create Task" destroy-on-close hide-footer>
      <CreateTask :incident="incident" @saved="fetchIncidentTasks" />
    </el-dialog>
  </el-card>
</template>
<script>
import Resource from '@/api/resource'
import ViewTask from './ViewTask.vue'
import CreateTask from './CreateTask.vue'

export default {
  components: {
    ViewTask,
    CreateTask
  },
  props: {
    incident: {
      type: Object,
      default: () => null
    },
    clientUsers: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showMenu: true,
      tasks: [],
      selectedData: null,
      loading: false,
      inputValue: '',
      filterText: '',
      isEdit: false,
      showModal: false,
      loadView: false,
      viewType: 'welcome'
    }
  },
  mounted() {
    this.fetchIncidentTasks()
  },
  methods: {
    viewDetails(data, viewId) {
      if (data.id) {
        this.selectedData = data
        this.viewType = 'edit'
        this.showMenu = false
        this.changeActiveTabBgColor(viewId)
      }
    },
    changeActiveTabBgColor(viewId) {
      const divs = document.getElementsByClassName('el-card')
      // Loop through the buttons and add the activeCard class to the current/clicked button

      if (divs.length > 0) {
        for (let i = 0; i < divs.length; i++) {
          divs[i].style.background = '#ffffff'
          divs[i].style.color = '#000000'
        }
      }
      document.getElementById(viewId).style.background = '#000000'
      document.getElementById(viewId).style.color = '#ffffff'
    },
    fetchIncidentTasks(load) {
      this.showModal = false
      this.loading = load
      const fetchCriteriaResource = new Resource('isms/incidents/fetch-tasks')
      fetchCriteriaResource
        .list({ incident_id: this.incident.id })
        .then((response) => {
          this.tasks = response.tasks
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
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
