<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Manage Project Plan</h4>
          </el-col>
          <el-col cols="6">
            <span class="pull-right">
              <el-button
                v-if="checkPermission(['create-client project'])"
                v-ripple.400="'rgba(113, 102, 240, 0.15)'"
                variant="gradient-primary"
                @click="showModal = true"
              >
                <feather-icon icon="PlusIcon" class="mr-50" />
                <span class="align-middle">Create</span>
              </el-button>
            </span>
          </el-col>
        </el-row>
      </div>
    </template>
    <aside>
      <el-row :gutter="5">
        <el-col :lg="10">
          <el-select
            v-model="query.standard_id"
            placeholder="Select Standard"
            style="width: 100%"
            @input="fetchProjectPlan()"
          >
            <el-option
              v-for="(standard, index) in standards"
              :key="index"
              :value="standard.id"
              :label="standard.name"
            />
          </el-select>
        </el-col>
        <!-- <el-col :lg="10">
          <el-select
            v-model="query.project_phase_id"
            placeholder="Select Project Phase"
            style="width: 100%"
            @input="fetchProjectPlan()"
          >
            <el-option
              v-for="(project_phase, index) in project_phases"
              :key="index"
              :value="project_phase.id"
              :label="project_phase.title"
            />
          </el-select>
        </el-col> -->
        <!-- <el-col :lg="4">
          <el-button
            type="primary"
            @click="fetchProjectPlan()"
          >
            Fetch
          </el-button>
        </el-col> -->
      </el-row>
    </aside>
    <v-client-table
      v-model="general_project_plans"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <!-- <div
        slot="child_row"
        slot-scope="props"
      >
        <el-alert
          type="success"
          :closable="false"
        >
          Standards implementing this project plan
        </el-alert>
        <aside>
          Pick standards to link up with plan
          <el-row :gutter="5">
            <el-col :lg="10">
              <el-select
                v-model="form.standard_ids"
                placeholder="Select Standards"
                multiple
                collapse-tags
                style="width: 100%"
              >
                <el-option
                  v-for="(standard, index) in standards"
                  :key="index"
                  :value="standard.id"
                  :label="standard.name"
                />
              </el-select>
            </el-col>
            <el-col :lg="4">
              <el-button
                type="primary"
                @click="linkStandardsToPlan(props.row.id)"
              >
                Link
              </el-button>
            </el-col>
          </el-row>
        </aside>
        <v-client-table
          v-model="props.row.standards"
          :columns="['name','action']"
          :options="{ filterable: false }"
        >
          <div
            slot="action"
            slot-scope="{row}"
          >
            <el-tooltip
              content="Unlink Standard"
              placement="top"
            >
              <el-button
                circle
                type="danger"
                @click="unlinkStandardFromPlan(props.row.id, row.id)"
              >
                <feather-icon icon="XIcon" />
              </el-button>
            </el-tooltip>
          </div>
        </v-client-table>
      </div> -->
      <template v-slot:action="props">
        <div>
          <el-button
            variant="gradient-warning"
            class="btn-icon rounded-circle"
            @click="editRow(props.row)"
          >
            <feather-icon icon="EditIcon" />
          </el-button>
          <el-button
            variant="gradient-danger"
            class="btn-icon rounded-circle"
            @click="destroyProjectPlan(props.row)"
          >
            <feather-icon icon="TrashIcon" />
          </el-button>
        </div>
      </template>
    </v-client-table>
    <el-modal v-model="showModal" hide-footer centered size="lg" title="Create Project Plan">
      <add-general-project-plan
        v-if="showModal"
        :standards="standards"
        :project-phases="project_phases"
      />
    </el-modal>
    <el-modal v-model="showEditModal" hide-footer centered size="lg" title="Edit Project Plan">
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Task</th>
            <th>Responsibility</th>
            <th>Resource</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <el-input v-model="selectedRow.task" placeholder="Enter Task" type="text" />
            </td>
            <td>
              <el-input
                v-model="selectedRow.responsibility"
                placeholder="Who is responsible?"
                type="text"
              />
            </td>
            <td>
              <el-input v-model="selectedRow.resource" placeholder="Enter Resource" type="text" />
            </td>
          </tr>
          <tr>
            <td colspan="3" align="right">
              <el-button round type="success" @click="update()"> Update </el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </el-modal>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import AddGeneralProjectPlan from './partials/AddGeneralProjectPlan.vue'

export default {
  components: {
    AddGeneralProjectPlan
  },
  directives: {
    Ripple
  },
  data() {
    return {
      loading: false,
      showModal: false,
      showEditModal: false,
      selectedRow: {},
      pageLength: 10,
      dir: false,
      columns: [
        'action',
        // 'standard.name',
        'project_phase.title',
        'task',
        'responsibility',
        'resource'
      ],

      options: {
        headings: {
          // 'standard.name': 'Standard',
          'project_phase.title': 'Project Phase'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        // filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['task'],
        // filterable: false,
        filterable: ['task']
      },
      general_project_plans: [],
      project_phases: [],
      standards: [],
      query: {
        standard_id: '',
        project_phase_id: ''
      },
      form: {
        standard_ids: []
      }
    }
  },
  created() {
    this.fetchStandards()
  },
  methods: {
    checkPermission,
    fetchStandards() {
      const fetchStandardsResource = new Resource('standards')
      fetchStandardsResource.list().then((response) => {
        this.standards = response.standards
      })
    },
    fetchProjectPlan(load = true) {
      this.loading = load
      const fetchProjectsResource = new Resource('project-plans/fetch-gen-project-plans')
      fetchProjectsResource.list(this.query).then((response) => {
        this.general_project_plans = response.general_project_plans
        this.loading = false
      })
    },
    editRow(row) {
      this.selectedRow = row
      this.showEditModal = true
    },
    update() {
      const form = this.selectedRow
      const updateProjectsResource = new Resource('project-plans/update-project-plan')
      updateProjectsResource.update(form.id, form).then(() => {
        this.showEditModal = false
        this.fetchProjectPlan()
      })
    },
    linkStandardsToPlan(planId) {
      const linkStandardToProjectsResource = new Resource(
        'project-plans/link-standards-to-project-plan'
      )
      linkStandardToProjectsResource.update(planId, this.form).then(() => {
        this.fetchProjectPlan()
      })
    },
    unlinkStandardFromPlan(planId, standardId) {
      const unlinkStandardFromProjectsResource = new Resource(
        'project-plans/unlink-standard-from-project-plan'
      )
      unlinkStandardFromProjectsResource.update(planId, { standard_id: standardId }).then(() => {
        this.fetchProjectPlan()
      })
    },
    destroyProjectPlan(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('project-plans/destroy-project-plans')
        destroyProjectsResource.destroy(row.id).then(() => {
          this.fetchProjectPlan()
          this.loading = false
        })
      }
    }
  }
}
</script>
