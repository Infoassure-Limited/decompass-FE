<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Module Packages</h4>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- table -->
    <h4>Click on the <code>+</code> sign to view package details</h4>
    <v-client-table
      :data="activated_modules"
      v-loading="loading"
      :columns="columns"
      :options="options"
    >
      <template v-slot:child_row="{ row }">
        <div>
          <aside>
            <el-row :gutter="15">
              <el-col :xs="24" :sm="12" :md="12" :lg="12">
                <h3>Clients on Module Package</h3>
                <table class="table table-bordered">
                  <tbody>
                    <tr v-for="client in row.clients" :key="client.id">
                      <td>{{ client.name }}</td>
                      <td>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          content="Remove Client"
                          placement="top-start"
                        >
                          <el-button
                            variant="gradient-danger"
                            class="btn-icon rounded-circle"
                            @click="removeClientModule(row.id, client.id)"
                          >
                            <feather-icon icon="TrashIcon" />
                          </el-button>
                        </el-tooltip>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </el-col>
            </el-row>
          </aside>
        </div>
      </template>
      <template v-slot:action="props">
        <div>
          <el-tooltip class="item" effect="dark" content="Add Partners" placement="top-start">
            <el-button variant="gradient-primary" class="btn-icon" @click="addModule(props.row)">
              <feather-icon icon="PlusIcon" /> Add Client
            </el-button>
          </el-tooltip>
        </div>
      </template>
    </v-client-table>
    <add-clients-to-module
      v-if="isCreatePackageModuleSidebarActive"
      v-model="isCreatePackageModuleSidebarActive"
      :selected-package="selectedPackage"
      @save="updateTable"
    />
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import AddClientsToModule from './partials/AddClientsToModule.vue'

export default {
  components: {
    // VueGoodTable,
    AddClientsToModule
  },
  directives: {
    Ripple
  },
  data() {
    return {
      loading: false,
      isCreatePackageSidebarActive: false,
      isCreatePackageModuleSidebarActive: false,
      isCreateSchoolPackageSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: ['available_module.name', 'action'],

      options: {
        headings: {
          'available_module.name': 'Module Name'
        },
        pagination: {
          dropdown: true,
          chunk: 10
        },
        perPage: 10,
        filterByColumn: true,
        texts: {
          filter: 'Search:'
        },
        sortable: ['available_module.name'],
        // filterable: false,
        filterable: ['available_module.name']
      },
      activated_modules: [],
      searchTerm: '',
      selectedPackage: '',
      selected_row_index: ''
    }
  },
  created() {
    this.fetchPackages()
  },
  methods: {
    fetchPackages() {
      this.loading = true
      const fetchPackageResource = new Resource('packages/fetch-activated-modules')
      fetchPackageResource.list().then((response) => {
        this.activated_modules = response.activated_modules
        this.loading = false
      })
    },
    updateTable() {
      this.fetchPackages()
    },
    addModule(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.selectedPackage = selectedRow
      this.isCreatePackageModuleSidebarActive = true
    },
    removeClientModule(id, clientId) {
      // console.log(props)

      if (window.confirm('Kindly confirm action')) {
        // this.packages = []
        const fetchPackageResource = new Resource('packages/deactivate-client-module')
        fetchPackageResource.update(id, { client_id: clientId }).then(() => {
          this.fetchPackages()
          this.loading = false
        })
      }
    },
    updateEditedTableRow() {
      this.fetchPackages()
    }
  }
}
</script>
