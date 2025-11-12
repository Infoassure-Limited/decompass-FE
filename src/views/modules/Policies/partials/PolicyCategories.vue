<template>
  <div v-loading="loading">
    <el-row :gutter="10">
      <el-col :md="12">
        <h3> Policy Categories </h3>
      </el-col>
      <el-col :md="12">
        <div class="pull-right">
          <el-button v-if="!showCreate" type="primary" @click="showCreate = true"
            ><Icon icon="tabler:plus" /> Create</el-button
          >
          <!-- <el-button v-if="showCreate" type="danger" @click="showCreate = false"
            >Hide Create Form</el-button
          > -->
        </div>
      </el-col>
    </el-row>
    <hr />
    <!-- <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      /> -->
    <v-client-table :data="policy_categories" :columns="columns" :options="options">
      <template v-slot:description="{ row }">
        <span v-html="row.description"></span>
      </template>
      <template v-slot:created_at="{ row }">
        {{ moment(row.created_at).format('lll') }}
      </template>
      <template v-slot:updated_at="{ row }">
        {{ moment(row.updated_at).calendar() }}
      </template>

      <template v-slot:action="{ row }">
        <div>
          <el-button-group>
            <el-tooltip content="Edit">
              <el-button type="default" @click="editEntry(row)">
                <Icon icon="tabler:edit" />
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
    <el-dialog
      v-model="showCreate"
      title="Create Policy Category"
      size="lg"
      destroy-on-close
      hide-footer
    >
      <CreatePolicyCategory :client-id="selectedClient.id" @saved="fetchPolicyCategories" />
    </el-dialog>
    <el-dialog
      v-model="showEdit"
      title="Update Policy Category"
      size="lg"
      destroy-on-close
      hide-footer
    >
      <EditPolicyCategory
        :client-id="selectedClient.id"
        :selected-data="selectedData"
        @updated="fetchPolicyCategories"
      />
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
import CreatePolicyCategory from './CreatePolicyCategory.vue'
import EditPolicyCategory from './EditPolicyCategory.vue'

export default {
  components: {
    CreatePolicyCategory,
    EditPolicyCategory
  },
  data() {
    return {
      showEdit: false,
      selectedData: null,
      form: { client_id: '', names: [] },
      policy_categories: [],
      clients: [],
      loading: false,
      showCreate: false,
      columns: ['name', 'description', 'created_at', 'action'],
      options: {
        headings: {},
        filterByColumn: false,
        sortable: [],
        filterable: []
      },
      search: ''
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  created() {
    this.fetchPolicyCategories()
  },
  methods: {
    moment,
    fetchPolicyCategories() {
      const fetchEntryResource = new Resource('policy/policy-categories')
      this.loading = true
      this.showCreate = false
      this.showEdit = false
      fetchEntryResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.policy_categories = response.data
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    editEntry(row) {
      this.selectedData = row
      this.showEdit = true
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('policy/policy-categories/destroy')
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
