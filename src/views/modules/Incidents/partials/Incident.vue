<template>
  <div>
    <el-row v-if="viewType === 'tabular'" :gutter="10">
      <el-col :md="20">
        <h3> Incidents </h3>
      </el-col>
      <el-col :md="3">
        <el-button
          :disabled="form.category_id === undefined"
          type="primary"
          @click="showCreate = true"
        >
          <Icon icon="tabler:plus" /> Report Incident
        </el-button>
      </el-col>
      <el-col :md="24">
        <div v-if="loading">
          <el-row :gutter="15">
            <el-col v-for="(count, count_index) in 5" :key="count_index" :md="24">
              <el-skeleton :loading="loading" :rows="1" animated />
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <v-client-table :data="incidents" :columns="columns" :options="options">
            <template v-slot:created_at="{ row }">
              {{ moment(row.created_at).format('ll') }}
            </template>

            <template v-slot:action="{ row }">
              <div>
                <el-button-group>
                  <el-tooltip content="View">
                    <el-button
                      type="default"
                      @click="((selectedData = row), (viewType = 'details'))"
                    >
                      <Icon icon="tabler:eye" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Delete">
                    <el-button type="danger" plain @click="deleteEntry(row)">
                      <Icon icon="tabler:trash" />
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
            </template>
          </v-client-table>
        </div>
        <el-row :gutter="20">
          <pagination
            v-show="pagination.total > 10"
            :total="pagination.total"
            :page="pagination.current_page"
            :limit="pagination.per_page"
            @pagination="fetchIncidents"
          />
        </el-row>
        <el-dialog
          v-model="showCreate"
          title="Report Incident"
          width="70%"
          destroy-on-close
          hide-footer
        >
          <CreateIncident @saved="fetchIncidents" />
        </el-dialog>
      </el-col>
    </el-row>
    <el-row v-if="viewType === 'details'" :gutter="20">
      <el-col :md="22">
        <h3>Incident No: {{ selectedData.incident_no }}</h3>
        <strong>Incident Type: {{ selectedData.incident_type.name }}</strong>
      </el-col>
      <el-col :md="2">
        <el-tooltip content="Close">
          <el-button type="danger" size="small" @click="viewType = 'tabular'">
            <Icon icon="tabler:x" />
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :md="24">
        <Details :selected-data="selectedData" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import Resource from '@/api/resource'
// import Assets from './Assets.vue'
import CreateIncident from './CreateIncident.vue'
import Details from './Details.vue'

export default {
  components: {
    Pagination,
    CreateIncident,
    Details
  },
  data() {
    return {
      viewType: 'tabular',
      selectedData: null,
      form: {
        category_id: ''
      },
      incidents: [],
      policy_categories: [],
      loading: false,
      showCreate: false,
      columns: ['incident_no', 'title', 'severity', 'status', 'created_at', 'action'],
      options: {
        headings: {
          created_at: 'Created'
        },
        filterByColumn: false,
        sortable: [],
        filterable: []
      },
      search: '',
      pagination: {
        total: 0,
        count: 0,
        per_page: 15,
        current_page: 1,
        total_pages: 1
      }
    }
  },
  watch: {
    category() {
      // this.form.category_id = this.category.id
      this.fetchIncidents()
    }
  },
  mounted() {
    // this.form.category_id = this.category.id
    this.fetchIncidents()
    // this.fetchPolicyDashboard()
  },
  methods: {
    moment,
    fetchIncidents() {
      const fetchEntryResource = new Resource('isms/incidents')
      this.loading = true
      this.showCreate = false
      this.showEdit = false
      fetchEntryResource
        .list()
        .then((response) => {
          this.incidents = response.data
          this.pagination = response.meta
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    fetchPolicyDashboard() {
      const dashboardResource = new Resource('policy/dashboard')
      this.loading = true
      this.showCreate = false
      this.showEdit = false
      dashboardResource
        .list()
        .then((response) => {
          this.incidents = response.data
          this.pagination = response.pagination
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('policy/incidents/destroy')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchPolicyCategories()
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            this.$message.error(error.response.data.error)
            this.loading = false
          })
      }
    }
  }
}
</script>
