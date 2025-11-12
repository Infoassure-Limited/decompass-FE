<template>
  <div v-if="project_phases !== '{}'">
    <el-collapse v-loading="loading" accordion type="border">
      <el-collapse-item
        v-for="(project_phase_array, title) in project_phases"
        :key="title"
        :title="title"
      >
        <table class="table table-striped table-bordered table-responsive">
          <thead>
            <tr>
              <th>Task</th>
              <th>Responsible</th>
              <th>Resource</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Pending Items</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project_phase, index) in project_phase_array" :key="index">
              <td>{{ project_phase.general_project_plan.task }}</td>
              <td>{{
                project_phase.general_project_plan.responsibility.replace(
                  'Client',
                  selectedProject.client.name
                )
              }}</td>
              <td>{{ project_phase.general_project_plan.resource }}</td>
              <td v-if="isAdmin">
                <select
                  v-model="project_phase.progress"
                  @change="updateFields('progress', $event, project_phase.id)"
                >
                  <option
                    v-for="(count, count_index) in progress"
                    :key="count_index"
                    :label="`${count}%`"
                    :value="count"
                  ></option>
                </select>
              </td>
              <td v-else> {{ project_phase.progress }}% </td>
              <td v-if="isAdmin">
                <select
                  v-model="project_phase.status"
                  @change="updateFields('status', $event, project_phase.id)"
                >
                  <option
                    v-for="(status, status_index) in statuses"
                    :key="status_index"
                    :label="status"
                    :value="status"
                  ></option>
                </select>
              </td>
              <td v-else>
                {{ project_phase.status }}
              </td>
              <td v-if="isAdmin">
                <textarea
                  v-model="project_phase.pending_items"
                  @blur="updateFields('pending_items', $event, project_phase.id)"
                ></textarea>
              </td>
              <td v-else>
                {{ project_phase.pending_items }}
              </td>
              <td v-if="isAdmin">
                <textarea
                  v-model="project_phase.risk"
                  @blur="updateFields('risk', $event, project_phase.id)"
                ></textarea>
              </td>
              <td v-else>
                {{ project_phase.risk }}
              </td>
            </tr>
          </tbody>
        </table>
      </el-collapse-item>
    </el-collapse>
  </div>
  <el-empty v-else><h3>Project Plan is yet to be set up</h3></el-empty>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedProject: {
      type: Object,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      project_phases: {},
      loading: false,
      showModal: false,
      columns: [
        'general_project_plan.task',
        'general_project_plan.responsibility',
        'general_project_plan.resource',
        'progress',
        'status',
        'pending_items',
        'risk'
      ],
      options: {
        headings: {
          'general_project_plan.project_phase.title': 'Phase',
          'general_project_plan.task': 'Task',
          'general_project_plan.responsibility': 'Responsible',
          'general_project_plan.resource': 'Resource'
        },
        sortable: [],
        // filterable: false,
        filterable: false
      },
      progress: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      statuses: ['Not Started', 'In Progress', 'Completed']
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    }
  },
  created() {
    this.fetchClientProjectPlan()
  },
  methods: {
    fetchClientProjectPlan() {
      const params = {
        project_id: this.selectedProject.id,
        client_id: this.selectedProject.client_id
      }
      this.loading = true
      const clientProjectPlanResource = new Resource('project-plans/fetch-client-project-plan')
      clientProjectPlanResource
        .list(params)
        .then((response) => {
          this.project_phases = response.project_phases
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          this.$message(e.response.message)
        })
    },
    updateFields(field, event, id) {
      const params = {
        field,
        value: event.target.value
      }
      // this.loading = true
      const clientProjectPlanResource = new Resource(
        'project-plans/update-client-project-plan-fields'
      )
      clientProjectPlanResource
        .update(id, params)
        .then(() => {
          this.loading = false
        })
        .catch((e) => {
          this.loading = false
          this.$message(e.response.message)
        })
    }
  }
}
</script>
<style scoped>
.table td {
  padding: 0.5rem 0.5rem;
}
</style>
