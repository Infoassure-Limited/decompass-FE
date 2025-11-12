<template>
  <div v-loading="loading">
    <div>
      <el-row>
        <el-col :md="12">
          <h4>Manage Impact Recovery Requirements by Time</h4>
        </el-col>
      </el-row>
    </div>
    <!-- <aside>

      Create New Entry
      <el-row :gutter="10">
        <el-col
          :xs="24"
          :sm="10"
          :md="10"
        >
          <el-input
            v-model="form.name"
            placeholder="Example: 2 hours"
            style="width: 100%"
          />
        </el-col>
        <el-col
          :xs="24"
          :sm="8"
          :md="8"
        >
          <el-input
            v-model="form.time_in_minutes"
            type="number"
            placeholder="Example: 120"
            style="width: 100%"
          >
            <template #append>
              Minutes
            </template>
          </el-input>
        </el-col>
        <el-col
          :xs="24"
          :sm="4"
          :md="4"
        >
          <small>&nbsp;</small>
          <el-button
            variant="primary"
            @click="saveImpactCriteria()"
          >
            Submit
          </el-button>
        </el-col>
      </el-row>
    </aside> -->
    <v-client-table :data="time_recovery_requirements" :columns="columns" :options="options">
      <template v-slot:name="props">
        <div>
          <input
            v-model="props.row.name"
            class="form-control"
            type="text"
            @blur="updateEntry($event.target.value, props.row.id)"
          />
        </div>
      </template>
      <template v-slot:time_in_minutes="props">
        <div>
          <el-input
            v-model="props.row.time_in_minutes"
            type="number"
            placeholder="Example: 120"
            @blur="updateEntry($event, props.row.id)"
          >
            <template #append> Minutes </template>
          </el-input>
        </div>
      </template>
      <!-- <div
        slot="action"
        slot-scope="props"
      >
        <el-button
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow(props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </el-button>
      </div> -->
    </v-client-table>
    <create-impact-criteria
      v-if="isCreateCriteriaSidebarActive"
      v-model="isCreateCriteriaSidebarActive"
      :clients="clients"
      @save="fetchCriteria"
    />
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateImpactCriteria from './CreateImpactCriteria.vue'

export default {
  components: {
    CreateImpactCriteria
  },
  data() {
    return {
      loading: false,
      isCreateCriteriaSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'time_in_minutes'
        // 'action',
      ],
      options: {
        headings: {
          name: 'Time Tag',
          time_in_minutes: 'Time in Minutes'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: false,
        texts: {
          filter: 'Search:'
        },
        sortable: [],
        // filterable: false,
        filterable: []
      },
      form: {
        client_id: '',
        name: '',
        time_in_minutes: null
      },
      time_recovery_requirements: [],
      clients: [],
      business_units: []
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.form.client_id = this.selectedClient.id
      this.fetchTimeRecoveryRequirement()
    }
  },
  created() {
    this.form.client_id = this.selectedClient.id
    if (this.selectedClient.id !== null) {
      this.fetchTimeRecoveryRequirement()
    } else {
      this.$alert('Please select a client to continue')
    }
  },
  methods: {
    checkPermission,
    fetchTimeRecoveryRequirement() {
      this.loading = true
      this.isCreateCriteriaSidebarActive = false
      const fetchCriteriaResource = new Resource('business-units/get-bia-time-recovery-requirement')
      fetchCriteriaResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.time_recovery_requirements = response.time_recovery_requirements
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveImpactCriteria() {
      this.loading = true
      const saveCriteriaResource = new Resource('business-units/save-bia-time-recovery-requirement')
      saveCriteriaResource
        .store(this.form)
        .then(() => {
          this.$message('Successful')
          this.form.name = ''
          this.form.time_in_minutes = ''
          this.fetchTimeRecoveryRequirement()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateEntry(field, value, id) {
      const updateCriteriaResource = new Resource(
        'business-units/update-bia-time-recovery-requirement'
      )
      updateCriteriaResource
        .update(id, { field, value })
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource(
          'business-units/delete-bia-time-recovery-requirement'
        )
        destroyProjectsResource
          .destroy(row.id)
          .then(() => {
            this.$message('Successful')
            this.fetchTimeRecoveryRequirement()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
