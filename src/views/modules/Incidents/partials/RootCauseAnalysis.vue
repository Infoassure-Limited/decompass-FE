<template>
  <div>
    <el-row v-if="viewType === 'tabular'" :gutter="10">
      <el-col :md="20">
        <h3> Root Cause Analysis </h3>
      </el-col>
      <el-col :md="3">
        <el-button
          :disabled="form.category_id === undefined"
          type="primary"
          @click="showCreate = true"
        >
          <Icon icon="tabler:plus" /> Add New
        </el-button>
      </el-col>
      <el-col :md="24">
        <div v-loading="loading">
          <v-client-table :data="rcas" :columns="columns" :options="options">
            <template v-slot:created_at="{ row }">
              {{ moment(row.created_at).format('ll') }}
            </template>

            <template v-slot:action="{ row }">
              <div>
                <el-tooltip content="Delete">
                  <el-button type="danger" plain @click="deleteEntry(row)">
                    <Icon icon="tabler:trash" />
                  </el-button>
                </el-tooltip>
                <!-- <el-button-group>
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
                </el-button-group> -->
              </div>
            </template>
          </v-client-table>
        </div>
        <el-dialog
          v-model="showCreate"
          title="Create Root Cause Analysis"
          width="70%"
          destroy-on-close
          hide-footer
        >
          <CreateRCA :incident-id="incident.id" @saved="fetchRCSAs" />
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import moment from 'moment'
import Resource from '@/api/resource'
import CreateRCA from './CreateRCA.vue'
export default {
  components: {
    CreateRCA
  },
  props: {
    incident: {
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
      rcas: [],
      policy_categories: [],
      loading: false,
      showCreate: false,
      columns: [
        'description',
        'impact_of_the_incident',
        'preventive_measures',
        'follow_up_required',
        'method',
        'action'
      ],
      options: {
        headings: {
          impact_of_the_incident: 'Impact',
          preventive_measures: 'Preventive Measures',
          follow_up_required: 'Requires Follow Up'
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
    incident() {
      // this.form.category_id = this.category.id
      this.fetchRCSAs()
    }
  },
  mounted() {
    // this.form.category_id = this.category.id
    this.fetchRCSAs()
    // this.fetchPolicyDashboard()
  },
  methods: {
    moment,
    fetchRCSAs() {
      const fetchEntryResource = new Resource('isms/incidents/fetch-rca')
      this.loading = true
      this.showCreate = false
      this.showEdit = false
      fetchEntryResource
        .list({ incident_id: this.incident.id })
        .then((response) => {
          this.rcas = response.rcas
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
        const saveEntryResource = new Resource('isms/incidents/destroy-rca')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.fetchRCSAs()
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
