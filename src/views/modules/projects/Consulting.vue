<template>
  <el-card>
    <div v-if="showManageProject">
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage {{ selected_project.standard.name }}</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-danger"
                size="sm"
                @click="showManageProject = false"
              >
                <icon icon="ArrowLeftIcon" class="mr-50" />
                <span class="align-middle">Back</span>
              </el-button>
            </span>
          </el-col>
          <hr />
        </el-row>
      </div>
      <client-project-details :selected-project="selected_project" />
    </div>
    <div v-else>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>{{ consulting.name }}</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                size="sm"
                @click="isCreateConsultingSidebarActive = true"
              >
                <icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
      <!-- table -->

      <v-client-table v-model="projects" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:action="props">
          <div>
            <el-tooltip :content="`Manage ${props.row.standard.name}`" placement="top">
              <el-button
                variant="gradient-danger"
                class="btn-icon rounded-circle"
                @click="manageProject(props.row)"
              >
                <icon icon="SettingsIcon" />
              </el-button>
            </el-tooltip>
            <!-- <el-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <icon icon="TrashIcon" />
        </el-button> -->
          </div>
        </template>
      </v-client-table>
      <add-project
        v-if="isCreateConsultingSidebarActive"
        v-model="isCreateConsultingSidebarActive"
        :consulting="consulting"
        :registered-standards="registeredStandardsIds"
        @save="updateTable"
      />
    </div>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import AddProject from './partials/AddProject.vue'
import ClientProjectDetails from './partials/ClientProjectDetails.vue'

export default {
  components: {
    AddProject,
    ClientProjectDetails
  },
  props: {
    consulting: {
      type: Object,
      default: () => ({ id: '', name: '' })
    }
  },
  data() {
    return {
      loading: false,
      isCreateConsultingSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: ['standard.name', 'action'],

      options: {
        headings: {
          'standard.name': 'Project'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['standard.name'],
        // filterable: false,
        filterable: ['standard.name']
      },
      projects: [],
      registeredStandardsIds: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false
    }
  },
  created() {
    this.fetchProjects()
  },
  methods: {
    fetchProjects() {
      const { id } = this.consulting
      this.loading = true
      const fetchProjectsResource = new Resource('projects')
      fetchProjectsResource.list({ consulting_id: id }).then((response) => {
        this.projects = response.projects // .data
        const registeredStandardsIds = []
        this.projects.forEach((project) => {
          registeredStandardsIds.push(project.standard.id)
        })
        this.registeredStandardsIds = registeredStandardsIds
        this.loading = false
      })
    },
    updateTable() {
      this.fetchProjects()
    },
    manageProject(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.selected_project = selectedRow
      this.showManageProject = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyConsultingsResource = new Resource('consultings/destroy')
        destroyConsultingsResource.destroy(row.id).then(() => {
          this.fetchConsultings()
          this.loading = false
        })
      }
    }
  }
}
</script>
