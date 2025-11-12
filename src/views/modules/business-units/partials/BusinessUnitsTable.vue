<template>
  <div v-loading="loading">
    <el-row>
      <el-col :md="12">
        <h3>Manage Business Units</h3>
      </el-col>
      <el-col :md="12">
        <span class="pull-right">
          <el-button type="primary" @click="isCreateBusinessUnitSidebarActive = true">
            <icon icon="tabler:plus" />
            <span class="align-middle">Create</span>
          </el-button>
        </span>
      </el-col>
    </el-row>
    <p>Click on the <code>+</code> sign to manage business processes</p>
    <v-client-table :data="business_units" :columns="columns" :options="options">
      <template v-slot:child_row="props">
        <div>
          <el-alert type="success" :closable="false">
            Business Processes for {{ props.row.unit_name }}
          </el-alert>
          <business-processes
            :can-change-status="true"
            :business-unit-id="props.row.id"
            :client-id="props.row.client_id"
          />
        </div>
      </template>
      <template v-slot:teams="{ row }">
        <div>
          <ol>
            <li v-for="team in row.teams" :key="team">
              {{ team }}
            </li>
          </ol>
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-tooltip content="Edit" placement="top">
            <el-button type="default" @click="editRow(props.row)">
              <Icon icon="tabler-edit" />
            </el-button>
          </el-tooltip>
          <!-- <el-button
          v-if="checkPermission(['delete-client project'])"
          variant="gradient-danger"
          class="btn-icon rounded-circle"
          @click="destroyRow($props.row)"
        >
          <feather-icon icon="TrashIcon" />
        </el-button> -->
        </div>
      </template>
    </v-client-table>
    <el-drawer
      v-model="isCreateBusinessUnitSidebarActive"
      title="Create Business Unit"
      :direction="direction"
      destroy-on-close
    >
      <create-business-unit :selected-client="selectedClient" @save="fetchBusinessUnits" />
    </el-drawer>
    <el-drawer
      v-model="isEditBusinessUnitSidebarActive"
      title="Edit Business Unit"
      :direction="direction"
      destroy-on-close
    >
      <edit-business-unit
        :selected-client="selectedClient"
        :business-unit="selectedBusinessUnit"
        @update="fetchBusinessUnits"
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

export default {
  components: {
    createBusinessUnit,
    editBusinessUnit,
    BusinessProcesses
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
      isCreateBusinessUnitSidebarActive: false,
      isEditBusinessUnitSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'group_name',
        'unit_name',
        'teams',
        'function_performed',
        'contact_phone',
        // 'access_code',
        'action'
      ],
      options: {
        headings: {
          group_name: 'Department (L1)',
          unit_name: 'Unit (L2)',
          teams: 'Sub-Units (L3)'
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
    fetchClients() {
      this.$store.dispatch('clients/fetchClients')
    },
    fetchBusinessUnits() {
      this.loading = true
      const fetchBusinessUnitsResource = new Resource('business-units/fetch-business-units')
      fetchBusinessUnitsResource
        .list({ client_id: this.selectedClient.id })
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
        const destroyProjectsResource = new Resource('business_units/destroy')
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
