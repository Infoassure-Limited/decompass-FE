<template>
  <div v-loading="loading">
    <div>
      <el-row>
        <el-col :md="12">
          <h4>Manage Impact Criteria</h4>
        </el-col>
        <el-col :md="12">
          <span class="pull-right">
            <el-button type="primary" @click="isCreateSidebarActive = true">
              <Icon icon="tabler:plus" />
              <span class="align-middle">Create</span>
            </el-button>
          </span>
        </el-col>
      </el-row>
    </div>
    <v-client-table :data="risk_impact_areas" :columns="columns" :options="options">
      <template v-slot:area="{ row }">
        <div>
          <div v-if="editablerow === row.id">
            <input
              v-model="row.area"
              type="text"
              class="form-control"
              @blur="editRow(row.id, $event)"
            />
          </div>
          <div v-else>
            {{ row.area }}
          </div>
        </div>
      </template>
      <template v-slot:action="{ row }">
        <div>
          <el-button-group>
            <el-tooltip content="Edit">
              <el-button type="default" @click="editablerow = row.id">
                <Icon icon="tabler:edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip content="Delete">
              <el-button type="danger" plain @click="destroyRow(row)">
                <Icon icon="tabler:trash" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
    </v-client-table>
    <el-drawer
      v-model="isCreateSidebarActive"
      title="Create Risk Impact Areas"
      direction="rtl"
      destroy-on-close
    >
      <create-risk :client-id="selectedClient.id" @save="fetchRiskImpactAreas" />
    </el-drawer>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import CreateRisk from './CreateRiskImpactArea.vue'

export default {
  components: {
    CreateRisk
  },
  data() {
    return {
      editablerow: null,
      loading: false,
      isCreateSidebarActive: false,
      pageLength: 10,
      dir: false,
      page: 'table',
      columns: ['area', 'action'],
      options: {
        headings: {
          area: 'Impact Areas'
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
      risk_impact_areas: []
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    selectedClient() {
      this.fetchRiskImpactAreas()
    }
  },
  created() {
    this.fetchRiskImpactAreas()
  },
  methods: {
    checkPermission,
    fetchRiskImpactAreas() {
      this.loading = true
      const fetchRisksResource = new Resource('fetch-risk-impact-area')
      fetchRisksResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.risk_impact_areas = response.risk_impact_areas
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    editRow(id, event) {
      const updateResource = new Resource('update-risk-impact-area')
      updateResource.update(id, { area: event.target.value }).then(() => {
        this.editablerow = null
        this.$message({
          message: 'Updated',
          type: 'success'
        })
        this.loading = false
      })
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyResource = new Resource('delete-risk-impact-area')
        destroyResource.destroy(row.id).then(() => {
          this.fetchRiskImpactAreas()
          this.loading = false
        })
      }
    }
  }
}
</script>
