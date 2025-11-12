<template>
  <div>
    <el-row v-if="viewType === 'tabular'" :gutter="10">
      <el-col :md="21">
        <h3> Policies under {{ category.name }}</h3>
      </el-col>
      <el-col :md="3">
        <el-button
          :disabled="form.category_id === undefined"
          type="primary"
          @click="showCreate = true"
        >
          <Icon icon="tabler:plus" /> Create
        </el-button>
      </el-col>
      <el-col :md="24">
        <div v-loading="loading">
          <v-client-table :data="policies" :columns="columns" :options="options">
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
            @pagination="fetchPolicies"
          />
        </el-row>
        <el-dialog v-model="showCreate" title="Create Policy" destroy-on-close hide-footer>
          <CreatePolicy
            :client-id="selectedClient.id"
            :category-id="category.id"
            @saved="fetchPolicies"
          />
        </el-dialog>
      </el-col>
    </el-row>
    <el-row v-if="viewType === 'details'" :gutter="20">
      <el-col :md="22">
        <h3> Details of Policy {{ selectedData.document_number }}</h3>
      </el-col>
      <el-col :md="2">
        <el-tooltip content="Close">
          <el-button type="danger" plain @click="viewType = 'tabular'">
            <Icon icon="tabler:x" />
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :md="24">
        <PolicyDetails :selected-data="selectedData" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import Resource from '@/api/resource'
// import Assets from './Assets.vue'
import CreatePolicy from './CreatePolicy.vue'
import PolicyDetails from './PolicyDetails.vue'

export default {
  components: {
    Pagination,
    CreatePolicy,
    PolicyDetails
  },
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      viewType: 'tabular',
      selectedData: null,
      form: {
        category_id: ''
      },
      policies: [],
      policy_categories: [],
      loading: false,
      showCreate: false,
      columns: ['title', 'document_number', 'status', 'created_at', 'action'],
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
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    category() {
      this.form.category_id = this.category.id
      this.fetchPolicies()
    }
  },
  mounted() {
    this.form.category_id = this.category.id
    this.fetchPolicies()
    this.fetchPolicyDashboard()
  },
  methods: {
    moment,
    fetchPolicies() {
      const fetchEntryResource = new Resource('policy/policies')
      this.loading = true
      this.showCreate = false
      this.showEdit = false
      fetchEntryResource
        .list(this.form)
        .then((response) => {
          this.policies = response.data
          this.pagination = response.pagination
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
          this.policies = response.data
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
        const saveEntryResource = new Resource('policy/policies/destroy')
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
