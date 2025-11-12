<template>
  <div v-if="showManageProject">
    <div>
      <el-row>
        <el-col cols="6">
          <h4>Manage {{ selected_project.standard.name }} for {{ selectedClient.name }}</h4>
        </el-col>
        <el-col cols="6">
          <span class="pull-right">
            <el-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              variant="gradient-danger"
              size="sm"
              @click="showManageProject = false"
            >
              <feather-icon icon="ArrowLeftIcon" class="mr-50" />
              <span class="align-middle">Back</span>
            </el-button>
          </span>
        </el-col>
        <hr />
      </el-row>
    </div>
    <client-project-details
      :selected-client="selectedClient"
      :selected-project="selected_project"
      :is-admin="true"
    />
  </div>
  <el-card v-else>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Client Projects</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-client project'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="isCreateProjectSidebarActive = true"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>

    <div class="demo-inline-spacing">
      <el-button
        v-if="clientUsers.length > 0 && projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-primary"
        @click="showAssignModal = true"
      >
        <feather-icon icon="UsersIcon" class="mr-50" />
        <span class="align-middle">Assign Projects To Personnel</span>
      </el-button>
      <!-- <el-button
        v-if="projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        variant="outline-dark"
        @click="showAssignConsultantModal = true"
      >
        <feather-icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To Consultant</span>
      </el-button> -->
    </div>
    <v-client-table v-model="projects" v-loading="loading" :columns="columns" :options="options">
      <!-- <div
        slot="allow_document_uploads"
        slot-scope="{row}"
      >
        <select
          v-model="row.allow_document_uploads"
          @change="changeDocumentUploadRestriction(row, $event, 'allow_document_uploads')"
        >
          <option
            :value="0"
            label="Disabled"
          />
          <option
            :value="1"
            label="Enabled"
          />
        </select>
      </div> -->
      <template v-slot:assigned_staff="{ row }">
        <div>
          <span v-for="(user, staff_index) in row.users" :key="staff_index"
            >{{ user.name }}<br
          /></span>
        </div>
      </template>
      <template v-slot:assigned_consultant="{ row }">
        <div>
          <span v-for="(user, consultant_index) in row.consultants" :key="consultant_index"
            >{{ user.name }}<br
          /></span>
        </div>
      </template>
      <template v-slot:is_completed="props">
        <div>
          <select
            v-model="props.row.is_completed"
            @input="toggleProjectCompletion(props.row, $event, 'is_completed')"
          >
            <option :value="0" label="In Progress"></option>
            <option :value="1" label="Completed"></option>
          </select>
        </div>
      </template>
      <!-- <div
        slot="start_date"
        slot-scope="props"
      >
        <el-date-picker
          v-model="props.row.start_date"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Set start date"
          style="width: 140px"
          @input="setDate($event, props.row, 'start_date')"
        />
      </div>
      <div
        slot="deadline"
        slot-scope="props"
      >
        <el-date-picker
          v-model="props.row.deadline"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Set a deadline"
          style="width: 140px"
          :picker-options="pickerOptions2"
          @input="setDate($event, props.row, 'deadline')"
        />
      </div>
      <div
        slot="date_completed"
        slot-scope="props"
      >
        <el-date-picker
          v-model="props.row.date_completed"
          type="date"
          format="dd-MM-yyyy"
          value-format="yyyy-MM-dd"
          placeholder="Set completion date"
          style="width: 140px"
          :picker-options="pickerOptions"
          @input="setDate($event, props.row, 'date_completed')"
        />
      </div> -->
      <template v-slot:progress="{ row }">
        <div style="width: 100%">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="row.progress"
            :color="customColorMethod"
          />
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-dropdown text="Action" class="m-2">
            <!-- <el-dropdown-item @click="manageProject(props.row)">
            <feather-icon icon="CheckSquareIcon" /> View Project Details
          </el-dropdown-item> -->
            <el-dropdown-item @click="showProjectSettings(props.row)">
              <feather-icon icon="ToolIcon" /> Project Settings
            </el-dropdown-item>
            <el-dropdown-item @click="setupProjectPlan(props.row)">
              <feather-icon icon="CheckSquareIcon" /> Activate project Plan
            </el-dropdown-item>
            <el-dropdown-item @click="destroyRow(props.row)">
              <feather-icon icon="TrashIcon" /> Delete Project
            </el-dropdown-item>
          </el-dropdown>
        </div>
      </template>
    </v-client-table>
    <el-modal
      v-model="showAssignModal"
      hide-footer
      centered
      title="Fill the form to assign projects"
    >
      <el-row v-loading="loading" :gutter="20">
        <el-col :xs="24">
          <el-select
            v-model="form.projectId"
            placeholder="Select Project"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project.id"
              :label="project.title"
            >
              <span style="float: left">{{ project.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                project.available_module ? project.available_module.name : ''
              }}</span>
            </el-option>
          </el-select>
          <br />
          <br />
        </el-col>
        <el-col :xs="24">
          <el-select
            v-model="form.userIds"
            placeholder="Select Company Staff"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(user, user_index) in clientUsers"
              :key="user_index"
              :value="user.id"
              :label="user.name"
            />
          </el-select>
          <hr />
        </el-col>
        <el-col :xs="24">
          <el-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-primary"
            @click="submitProjectAssignment()"
          >
            <feather-icon icon="SaveIcon" class="mr-50" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
      </el-row>
    </el-modal>
    <el-modal
      v-model="showAssignConsultantModal"
      hide-footer
      centered
      title="Fill the form to assign projects to consultants"
    >
      <el-row v-loading="loading" :gutter="20">
        <el-col :xs="24">
          <el-select
            v-model="consultantForm.projectIds"
            placeholder="Select Projects"
            multiple
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="(project, project_index) in projects"
              :key="project_index"
              :value="project.id"
              :label="project.title"
            >
              <span style="float: left">{{ project.title }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                project.available_module ? project.available_module.name : ''
              }}</span>
            </el-option>
          </el-select>
          <br />
          <br />
        </el-col>
        <el-col :xs="24">
          <el-select
            v-model="consultantForm.userIds"
            placeholder="Select Consultants"
            multiple
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
          <hr />
        </el-col>
        <el-col :xs="24">
          <el-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="gradient-primary"
            @click="assignProjectsToConsultant()"
          >
            <feather-icon icon="SaveIcon" class="mr-50" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
      </el-row>
    </el-modal>
    <add-project
      v-if="isCreateProjectSidebarActive"
      v-model="isCreateProjectSidebarActive"
      :clients="clients"
      @save="updateTable"
    />
    <client-project-settings
      v-if="isProjectSettingSidebarActive"
      v-model="isProjectSettingSidebarActive"
      :selected-project="selected_project"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import AddProject from './partials/AddProject.vue'
import ClientProjectSettings from './partials/ClientProjectSettings.vue'
// import ClientProjectDetails from './partials/ClientProjectDetails.vue'

export default {
  components: {
    AddProject,
    ClientProjectSettings
  },
  directives: {
    Ripple
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() <= Date.now()
        }
      },
      loading: false,
      isCreateProjectSidebarActive: false,
      isProjectSettingSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        // 'assigned_consultant',
        'title',
        // 'available_module.name',
        // 'standard.name',
        // 'allow_document_uploads',
        'progress',
        // 'id',
        // 'start_date',
        // 'deadline',
        // 'date_completed',
        'is_completed',
        'assigned_staff',
        'action'
      ],
      options: {
        headings: {
          title: 'Project',
          'available_module.name': 'Module',
          'standard.name': 'Standard',
          allow_document_uploads: 'Can Upload Documents',
          assigned_staff: 'Assigned Personnel',
          assigned_consultant: 'Assigned Consultant',
          is_completed: 'Completion Status'
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
        sortable: ['title'],
        // filterable: false,
        filterable: ['title']
      },
      projects: [],
      clients: [],
      staff: [],
      clientUsers: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
      showAssignModal: false,
      showAssignConsultantModal: false,
      consultantForm: {
        projectIds: [],
        userIds: []
      },
      form: {
        projectId: '',
        userIds: []
      }
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchProjects()
      this.fetchStaff()
    }
  },
  created() {
    this.fetchStaff()
    this.fetchProjects()
  },
  methods: {
    checkPermission,
    customColorMethod(percentage) {
      if (percentage <= 30) {
        return '#f56c6c'
      }
      if (percentage < 50) {
        return '#e6a23c'
      }
      if (percentage < 70) {
        return '#19ebfa'
      }
      if (percentage <= 99) {
        return '#6f7ad3'
      }
      return '#5cb87a'
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    fetchProjects() {
      this.form.projectId = ''
      // const module = this.$route.params.module
      this.loading = true
      const fetchProjectsResource = new Resource('projects/client-projects')
      fetchProjectsResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.projects = response.projects
          this.clientUsers = response.users // .data
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    showProjectSettings(project) {
      this.selected_project = project
      this.isProjectSettingSidebarActive = true
    },
    setupProjectPlan(project) {
      const params = {
        client_id: project.client_id,
        project_id: project.id,
        standard_id: project.standard_id
      }

      if (window.confirm(`Click OK to confirm plan setup for ${project.standard.name}`)) {
        this.loading = true
        const assignProjectsResource = new Resource('project-plans/store-client-project-plan')
        assignProjectsResource
          .store(params)
          .then(() => {
            this.fetchProjects()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    submitProjectAssignment() {
      // this.showAssignModal = false
      this.loading = true
      const assignProjectsResource = new Resource('projects/assign-to-user')
      assignProjectsResource
        .update(this.form.projectId, { user_ids: this.form.userIds })
        .then(() => {
          this.form = {
            projectId: [],
            userIds: []
          }
          this.$message('Action Successful')
          this.fetchProjects()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    assignProjectsToConsultant() {
      // this.showAssignModal = false
      this.loading = true
      const assignProjectsResource = new Resource('projects/assign-projects-to-consultant')
      assignProjectsResource
        .store({
          project_ids: this.consultantForm.projectIds,
          user_ids: this.consultantForm.userIds
        })
        .then(() => {
          this.consultantForm = {
            projectIds: [],
            userIds: []
          }
          this.$message('Action Successful')
          this.fetchProjects()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    unassignProjectFromConsultants(projectId, userId) {
      // this.showAssignModal = false
      this.loading = true
      const unassignProjectsResource = new Resource('projects/unassign-project-from-consultant')
      unassignProjectsResource
        .store({ project_id: projectId, user_id: userId })
        .then(() => {
          this.$message('Action Successful')
          this.fetchProjects()
          this.loading = false
        })
        .catch(() => {
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
    setDate(event, project, field) {
      const param = { field, date: event }

      // if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
      // this.loading = true
      const setDatesResource = new Resource('projects/set-dates')
      setDatesResource
        .update(project.id, param)
        .then(() => {
          this.$message('Action Successful')
          // this.fetchProjects()
          // this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      // }
    },
    changeDocumentUploadRestriction(project, event, field) {
      const { value } = event.target
      const param = { value, field }

      if (window.confirm('Click OK to confirm')) {
        // this.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource
          .update(project.id, param)
          .then(() => {
            this.$message('Action Successful')
            this.fetchProjects()
            // this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    toggleProjectCompletion(project, event, field) {
      const { value } = event.target
      const param = { value, field }

      if (window.confirm('Click OK to confirm')) {
        // this.loading = true
        const setDatesResource = new Resource('projects/update-random-fields')
        setDatesResource
          .update(project.id, param)
          .then(() => {
            this.$message('Action Successful')
            this.fetchProjects()
            // this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('projects/destroy')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchProjects()
          this.loading = false
        })
      }
    }
  }
}
</script>
