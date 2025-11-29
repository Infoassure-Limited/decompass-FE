<template>
  <div v-loading="loading">
    <el-row>
      <el-col :md="12">
        <h3>Manage Business Units</h3>
      </el-col>
      <el-col v-if="checkPermission(['create-business-unit'])" :md="12">
        <span class="pull-right">
          <el-button-group>
            <el-button type="primary" @click="isCreateBusinessUnitSidebarActive = true">
              <icon icon="tabler:plus" />
              <span class="align-middle">Create New</span>
            </el-button>

            <el-button type="info" @click="showBulkUploadModal = true">
              <icon icon="tabler:upload" />
              <span class="align-middle">Upload From Spreadsheet</span>
            </el-button>
          </el-button-group>
        </span>
      </el-col>
    </el-row>
    <v-client-table :data="business_units" :columns="columns" :options="options">
      <!-- <template v-slot:child_row="props">
        <div>
          <el-alert :closable="false"> Business Processes for {{ props.row.unit_name }} </el-alert>
          <business-processes
            :can-change-status="true"
            :business-unit-id="props.row.id"
            :client-id="props.row.client_id"
          />
        </div>
      </template> -->
      <template v-slot:teams="{ row }">
        <div>
          <ol>
            <li v-for="team in row.teams" :key="team">
              {{ team }}
            </li>
          </ol>
        </div>
      </template>
      <template v-slot:processes="{ row }">
        <div align="center">
          {{ row.business_processes_count }}
          <el-button
            v-if="checkPermission(['read-business-process'])"
            type="text"
            @click="showProcess(row)"
          >
            <icon icon="tabler:eye" /> View Business Processes
          </el-button>
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-button-group>
            <el-tooltip
              v-if="checkPermission(['update-business-unit'])"
              content="Edit"
              placement="top"
            >
              <el-button type="default" @click="editRow(props.row)">
                <Icon icon="tabler-edit" />
              </el-button>
            </el-tooltip>
            <el-tooltip
              v-if="checkPermission(['delete-business-unit'])"
              content="Delete"
              placement="top"
            >
              <el-button type="danger" @click="destroyRow($props.row)">
                <Icon icon="tabler-trash" />
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </template>
    </v-client-table>
    <el-drawer
      v-if="showBusinessProcessModal"
      v-model="showBusinessProcessModal"
      :title="`Business Processes for ${selectedBusinessUnit.unit_name}`"
      direction="rtl"
      size="87%"
      destroy-on-close
    >
      <business-processes
        :can-change-status="true"
        :business-unit-id="selectedBusinessUnit.id"
        :client-id="selectedBusinessUnit.client_id"
      />
    </el-drawer>
    <el-dialog
      v-model="isCreateBusinessUnitSidebarActive"
      title="Create Business Unit"
      :direction="direction"
      destroy-on-close
    >
      <create-business-unit :selected-client="selectedClient" @save="fetchBusinessUnits" />
    </el-dialog>
    <el-drawer
      v-model="isEditBusinessUnitSidebarActive"
      title="Edit Business Unit"
      size="87%"
      :direction="direction"
      destroy-on-close
    >
      <edit-business-unit
        :selected-client="selectedClient"
        :business-unit="selectedBusinessUnit"
        @update="fetchBusinessUnits"
      />
    </el-drawer>
    <el-drawer
      v-model="showBulkUploadModal"
      title="Upload Business Units from Spreadsheet"
      size="87%"
      destroy-on-close
      hide-footer
    >
      <BulkFileUpload
        type="business_units"
        :identifiers="['Unit Name']"
        @saved="fetchBusinessUnits"
      />
    </el-drawer>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import checkPermission from '@/utils/permission'
import createBusinessUnit from './CreateBusinessUnit.vue'
import editBusinessUnit from './EditBusinessUnit.vue'
import BusinessProcesses from './BusinessProcesses.vue'
import BulkFileUpload from '@/views/Components/UploadExcel/BulkFileUpload.vue'
export default {
  components: {
    createBusinessUnit,
    editBusinessUnit,
    BusinessProcesses,
    BulkFileUpload
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
      showBulkUploadModal: false,
      showBusinessProcessModal: false,
      isCreateBusinessUnitSidebarActive: false,
      isEditBusinessUnitSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'group_name',
        'unit_name',
        // 'teams',
        // 'function_performed',
        'processes',
        // 'access_code',
        'action'
      ],
      options: {
        headings: {
          group_name: 'Department (L1)',
          unit_name: 'Unit (L2)',
          teams: 'Sub-Units (L3)',
          processes: 'No. of Processes'
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
      business_units: [],
      selectedBusinessUnit: null,
      staff: [],
      clientUsers: [],
      searchTerm: '',
      selected_project: '',
      showManageProject: false,
      selectedClient: null,
      showAssignModal: false,
      showAssignConsultantModal: false
    }
  },
  computed: {
    clients() {
      return this.$store.getters.clients
    },
    storedClient() {
      return this.$store.getters.selectedClient
    }
  },
  watch: {
    storedClient() {
      this.selectedClient = this.storedClient
      this.fetchBusinessUnits()
    }
  },
  mounted() {
    this.fetchClients()
    this.selectedClient = this.storedClient
    // this.fetchBusinessUnits()
  },
  methods: {
    checkPermission,
    showProcess(row) {
      this.selectedBusinessUnit = row
      this.showBusinessProcessModal = true
    },
    fetchClients() {
      this.$store.dispatch('clients/fetchClients')
    },
    fetchBusinessUnits() {
      this.loading = true
      this.isEditBusinessUnitSidebarActive = false
      this.isCreateBusinessUnitSidebarActive = false
      this.showBulkUploadModal = false
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list()
        .then((response) => {
          this.business_units = response.business_units
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    editRow(row) {
      this.selectedBusinessUnit = row
      this.isEditBusinessUnitSidebarActive = true
    },
    destroyRow(row) {
      if (window.confirm('Are you sure you want to delete this entry?')) {
        this.loading = true
        const destroyProjectsResource = new Resource('business-units/destroy')
        destroyProjectsResource
          .destroy(row.id)
          .then(() => {
            this.fetchBusinessUnits()
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
