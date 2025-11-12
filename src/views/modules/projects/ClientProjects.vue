<template>
  <div v-if="showManageProject">
    <div>
      <el-row>
        <el-col :md="12">
          <span>
            <el-button
              v-ripple.400="'rgba(113, 102, 240, 0.15)'"
              type="danger"
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
          <el-col :md="12">
            <h3>Module Subscription</h3>
          </el-col>
          <el-col :md="12">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['manage-project-subscription']) || checkRole(['admin'])"
                type="primary"
                @click="isCreateProjectSidebarActive = true"
              >
                <icon icon="tabler:plus" />
                <span class="align-middle">Subscribe</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>

    <div>
      <el-row :gutter="10">
        <el-col :md="columnSize" :lg="columnSize" :xl="columnSize" :sm="12" :xs="24">
          <el-date-picker
            v-model="year"
            type="year"
            :disabled-date="disableFutureDates"
            format="YYYY"
            value-format="YYYY"
            placeholder="Pick a calendar year"
            style="width: 100%"
            @change="fetchProjects"
          />
        </el-col>
      </el-row>
      <!-- <el-button
        v-if="clientUsers.length > 0 && projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        type="outline-primary"
        @click="showAssignModal = true"
      >
        <icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To User</span>
      </el-button> -->
      <!-- <el-button
        v-if="projects.length > 0"
        v-ripple.400="'rgba(113, 102, 240, 0.15)'"
        type="outline-dark"
        @click="showAssignConsultantModal = true"
      >
        <icon
          icon="UsersIcon"
          class="mr-50"
        />
        <span class="align-middle">Assign Projects To Consultant</span>
      </el-button> -->
    </div>
    <br />
    <el-row v-if="loading" :gutter="15">
      <el-col
        v-for="(count, count_index) in 4"
        :key="count_index"
        :xs="24"
        :sm="24"
        :md="6"
        :lg="6"
        :xl="6"
      >
        <el-card>
          <el-skeleton :loading="loading" :rows="3" animated />
        </el-card>
      </el-col>
    </el-row>
    <div v-if="projects.length > 0">
      <el-row v-if="!loading" :gutter="15">
        <el-col
          v-for="(item, index) in projects"
          :key="index"
          :xs="24"
          :sm="24"
          :md="columnSize"
          :lg="columnSize"
          :xl="columnSize"
        >
          <el-card shadow="hover">
            <h3>{{ item.available_module.name }}</h3>
            <span>
              <small>{{ item.available_module.full_name }}</small>
            </span>
            <hr />
            <div class="mb-3">
              <!-- <span>Project Year: {{ item.year }}</span>
              <br /> -->
              <span v-if="item.start_date !== null">
                <icon size="20" icon="tabler:calendar-week" />
                {{ moment(item.start_date).format('MMMM YYYY') }} -
                {{ moment(item.deadline).format('MMMM YYYY') }}
              </span>
              <span v-else>
                <span
                  v-if="checkRole(['admin'])"
                  style="cursor: pointer"
                  @click="showSetDateModal(item)"
                >
                  <icon size="20" icon="tabler:calendar" color="brown" /> Click to set start date
                </span>
              </span>
            </div>
            <el-button-group>
              <el-tooltip content="View Project Details">
                <el-button @click="manageProject(item)">
                  <icon size="20" icon="tabler:eye" color="green" />
                </el-button>
              </el-tooltip>
              <el-tooltip v-if="checkRole(['admin'])" content="Set Start Date">
                <el-button @click="showSetDateModal(item)">
                  <icon size="20" icon="tabler:calendar" color="brown" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="checkPermission(['assign-project-to-user']) || checkRole(['admin'])"
                content="Assign project to users"
              >
                <el-button @click="assignProject(item)">
                  <icon size="20" icon="tabler:user-plus" />
                </el-button>
              </el-tooltip>
            </el-button-group>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-empty v-if="!loading" description="You have no active project">
        <el-button
          v-if="checkPermission(['create-client project']) || checkRole(['admin'])"
          type="primary"
          @click="isCreateProjectSidebarActive = true"
        >
          <icon icon="tabler:plus" />
          <span class="align-middle">Subscribe</span>
        </el-button>
      </el-empty>
    </div>

    <el-dialog
      v-model="showAssignModal"
      width="40%"
      hide-footer
      centered
      title="Fill the form to assign users to project"
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
        </el-col>
        <el-col :xs="24">
          <small>Select User (Multiple selection enabled)</small>
          <el-select
            v-model="form.userIds"
            placeholder="Select Users"
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
        </el-col>
        <el-col :md="12">
          <el-button type="primary" @click="submitProjectAssignment()">
            <icon icon="fa-save" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
        <el-col :md="12">
          <el-button type="text" @click="showUserRegistrationForm = true">
            Click here to create new user
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
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
            type="primary"
            @click="assignProjectsToConsultant()"
          >
            <icon icon="tabler:edit" class="mr-50" />
            <span class="align-middle">Save</span>
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog
      v-model="showUserRegistrationForm"
      hide-footer
      centered
      size="lg"
      title="Register New User"
    >
      <user-registration-form @saved="(fetchProjects(false), (showUserRegistrationForm = false))" />
    </el-dialog>
    <el-drawer
      title=""
      v-model="isCreateProjectSidebarActive"
      direction="ttb"
      size="100%"
      :destroy-on-close="true"
      :before-close="reloadPage"
    >
      <template v-slot:title>
        <h2>Subscribe from the list of packages</h2>
      </template>

      <add-project :clients="clients" @save="updateTable" />
    </el-drawer>
    <el-dialog
      v-model="isProjectSettingSidebarActive"
      hide-footer
      centered
      size="lg"
      title="Project Settings"
    >
      <client-project-settings
        v-if="isProjectSettingSidebarActive"
        v-model="isProjectSettingSidebarActive"
        :selected-project="selected_project"
      />
    </el-dialog>

    <el-dialog v-model="showCalendar" width="30%" hide-footer centered title="Set Start Date">
      <div v-loading="loadingDate">
        <el-date-picker
          v-model="selected_project.start_date"
          type="date"
          :disabled-date="disablePastDates"
          format="YYYY/MM/D"
          value-format="YYYY-MM-DD"
          placeholder="Pick a date"
          style="width: 100%"
        />
        <el-button
          type="primary"
          @click="setDate(selected_project.start_date, selected_project, 'start_date')"
        >
          Submit
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import moment from 'moment'
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import AddProject from './partials/AddProject.vue'
import ClientProjectSettings from './partials/ClientProjectSettings.vue'
import ClientProjectDetails from './partials/ClientProjectDetails.vue'
import UserRegistrationForm from '@/views/modules/user/partials/RegisterUserClient.vue'

export default {
  components: {
    // BDropdown,
    // BDropdownItem,
    AddProject,
    ClientProjectSettings,
    ClientProjectDetails,
    UserRegistrationForm
  },
  props: {
    columnSize: {
      type: Number,
      default: () => 6
    }
  },
  data() {
    return {
      disablePastDates(time) {
        return time.getTime() <= Date.now() - 8.64e7 // Disable past dates
      },
      disableFutureDates(time) {
        return time.getTime() > Date.now() - 8.64e7 // Disable past dates
      },
      showCalendar: false,
      loadingDate: false,
      loading: false,
      isCreateProjectSidebarActive: false,
      isProjectSettingSidebarActive: false,
      showUserRegistrationForm: false,
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
          assigned_staff: 'Assigned User',
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
      },
      year: null
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
    moment,
    checkPermission,
    checkRole,
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
    handleClose() {
      this.isCreateProjectSidebarActive = false
    },
    fetchStaff() {
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
      })
    },
    fetchProjects(load = true) {
      this.form.projectId = ''
      this.loading = load
      const fetchProjectsResource = new Resource('projects/client-projects')
      fetchProjectsResource
        .list({ client_id: this.selectedClient.id, year: this.year })
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
    showSetDateModal(project) {
      this.selected_project = project
      this.showCalendar = true
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
    assignProject(project) {
      this.selected_project = project
      this.form.projectId = project.id
      this.showAssignModal = true
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
    unassignUserFromProject(project, user) {
      this.$confirm(
        `This will disengage ${user.name} from the ${project.title} project. Continue?`,
        `Disengage ${user.name}?`,
        {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const unassignProjectsResource = new Resource('projects/unassign-user-from-project')
          unassignProjectsResource
            .update(project.id, { user_id: user.id })
            .then(() => {
              this.$message('Action Successful')
              this.fetchProjects()
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Action canceled',
          // })
        })
      // this.showAssignModal = false
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
      this.handleClose()
    },
    reloadPage() {
      this.$router.go(0)
    },
    manageProject(selectedRow) {
      // console.log(props)

      this.$router.push({ path: `/modules/${selectedRow.available_module.slug}-index` })

      // const editableRow = selected_row;
      // this.selected_project = selectedRow
      // this.showManageProject = true
    },
    setDate(event, project, field) {
      const param = { field, date: event }

      // if (window.confirm(`The ${field} will be set to ${event}. Click OK to continue`)) {
      this.loadingDate = true
      const setDatesResource = new Resource('projects/set-dates')
      setDatesResource
        .update(project.id, param)
        .then(() => {
          this.showCalendar = false
          this.$message('Action Successful')
          this.fetchProjects()
          this.loadingDate = false
        })
        .catch(() => {
          this.loadingDate = false
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
    toggleProjectCompletion(project, value, field) {
      // const { value } = event.target
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
