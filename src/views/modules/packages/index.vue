<template>
  <el-card>
    <template v-slot:header>
      <div>
        <el-row>
          <el-col cols="6">
            <h4>Modules & Packages</h4>
          </el-col>
        </el-row>
      </div>
    </template>
    <!-- table -->
    <h4>Click on the <code>+</code> sign to manage packages</h4>
    <v-client-table :data="modules" v-loading="loading" :columns="columns" :options="options">
      <template v-slot:child_row="{ row }">
        <div>
          <el-row :gutter="20">
            <el-col :md="6">
              <el-card>
                <template v-slot:header>
                  <div> Features of the {{ row.name }} Module </div>
                </template>
                <el-timeline>
                  <el-timeline-item
                    v-for="(feature, index) in row.features"
                    :key="index"
                    icon="el-icon-check"
                    color="#0bbd87"
                    size="large"
                  >
                    {{ feature.name }}
                  </el-timeline-item>
                </el-timeline>
              </el-card>
            </el-col>
            <el-col v-if="checkRole(['super'])" :md="18">
              <el-tabs type="border-card">
                <el-tab-pane label="Manage Packages">
                  <el-button type="primary" @click="createPackage(row, null, 'Create')">
                    <icon icon="tabler:plus" /> Create
                  </el-button>
                  <div v-if="row.packages.length > 0">
                    <table class="table">
                      <thead>
                        <tr>
                          <th></th>
                          <th v-for="(pack, package_index) in row.packages" :key="package_index">
                            <div>
                              <h3>{{ pack.name }}</h3>
                              <el-tooltip content="Edit">
                                <span
                                  class="cursor-pointer"
                                  @click="createPackage(row, pack, 'Update')"
                                >
                                  <icon color="#1858b8" size="20" icon="tabler:edit" />
                                </span>
                              </el-tooltip>
                              <span>&nbsp;&nbsp;</span>
                              <el-tooltip content="Delete">
                                <span class="cursor-pointer" @click="deletePackage(pack)">
                                  <icon color="#f00000" size="20" icon="tabler:trash" />
                                </span>
                              </el-tooltip>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(feature, feature_index) in row.features" :key="feature_index">
                          <td width="400">
                            <strong>{{ feature.name }}</strong>
                          </td>
                          <th v-for="(pack, package_index) in row.packages" :key="package_index">
                            <span v-if="pack.features.includes(feature.id)">
                              <icon size="20" color="green" icon="tabler:check" />
                            </span>
                            <span v-else>
                              <icon size="20" color="red" icon="tabler:x" />
                            </span>
                          </th>
                        </tr>
                        <tr>
                          <td>SUBSCRIPTION COST (₦)</td>
                          <td v-for="(pack, package_index) in row.packages" :key="package_index">
                            <strong>{{
                              parseFloat(pack.price).toLocaleString('en-US', {
                                minimumFractionDigits: 2
                              })
                            }}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else>
                    <el-empty description="No package is created yet" />
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Activated Partners">
                  <el-button type="primary" @click="addModule(row)">
                    <icon icon="tabler:plus" /> Add Partner
                  </el-button>
                  <table class="table table-bordered">
                    <tbody>
                      <tr v-for="a_module in row.activated_modules" :key="a_module.id">
                        <td>{{ a_module.partner.name }}</td>
                        <td>
                          <el-tooltip
                            class="item"
                            effect="dark"
                            content="Remove Partners"
                            placement="top-start"
                          >
                            <el-button type="danger" @click="removePartnerModule(a_module.id)">
                              <icon icon="tabler:trash" />
                            </el-button>
                          </el-tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
          <el-dialog
            :title="`${mode} Package for ${selectedModule.name}`"
            v-model="dialogVisible"
            width="50%"
          >
            <div v-loading="loading">
              <strong>Provide Package Name (e.g Silver, Gold, Platinum)</strong>
              <el-input v-model="packageForm.name" placeholder="Gold" style="width: 100%" />
              <br /><br />
              <strong>Set Subscription Cost</strong>
              <el-input
                v-model="packageForm.price"
                style="width: 100%"
                type="number"
                placeholder="Input Price"
              >
                <template v-slot:prepend> ₦ </template>
              </el-input>
              <br /><br />
              <aside>
                <strong>Pick Features</strong>
                <el-transfer
                  v-model="packageForm.features"
                  :titles="['Features List', 'Picked Features']"
                  :props="{
                    key: 'id',
                    label: 'name'
                  }"
                  style="width: 100%"
                  :data="selectedModule.features"
                />
              </aside>
            </div>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button v-if="mode === 'Create'" type="success" @click="submitPackage()"
                  >Submit</el-button
                >
                <el-button v-else type="warning" @click="updatePackage()">Update</el-button>
              </span>
            </template>
          </el-dialog>
        </div>
      </template>
      <template v-slot:name="props">
        <div>
          {{ `${props.row.name} - ${props.row.full_name}` }}
        </div>
      </template>
      <template v-slot:action="props">
        <div class="demo-inline-spacing">
          <!-- <el-button
          variant="outline-primary"
          class="btn-icon"
          @click="addModule(props.row)"
        >
          <icon icon="PlusIcon" /> Add Partner
        </el-button> -->
          <el-button type="info" class="btn-icon" @click="setupModule(props.row)">
            <icon icon="tabler:tool" /> Configure
          </el-button>
        </div>
      </template>
    </v-client-table>
    <el-dialog
      :title="`Assign Partners to ${selectedModule.name}`"
      v-model="isCreatePackageModuleSidebarActive"
    >
      <add-partners-to-module
        v-if="isCreatePackageModuleSidebarActive"
        :selected-package="selectedModule"
        @save="updateTable"
      />
    </el-dialog>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
import AddPartnersToModule from './partials/AddPartnersToModule.vue'
// import Setup from '@/views/modules/packages/Setup.vue'
import checkRole from '@/utils/role'

export default {
  components: {
    // VueGoodTable,
    AddPartnersToModule
  },
  data() {
    return {
      loading: false,
      isCreatePackageSidebarActive: false,
      isCreatePackageModuleSidebarActive: false,
      isCreateSchoolPackageSidebarActive: false,
      pageLength: 10,
      dir: false,
      dialogVisible: false,
      direction: 'ttb',
      columns: [
        'name'
        // 'slug',
        // 'action'
      ],

      options: {
        headings: {
          name: 'Module Name'
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
        sortable: ['name'],
        // filterable: false,
        filterable: ['name']
      },
      modules: [],
      searchTerm: '',
      selectedModule: '',
      selected_row_index: '',
      packageForm: {
        id: null,
        price: 0.0,
        features: [],
        name: '',
        available_module_id: null
      },
      mode: 'Create'
    }
  },
  created() {
    this.fetchPackages()
  },
  methods: {
    checkRole,
    fetchPackages(load = true) {
      this.dialogVisible = false
      this.loading = load
      const fetchPackageResource = new Resource('packages/fetch-modules')
      fetchPackageResource.list().then((response) => {
        this.modules = response.modules
        this.loading = false
      })
    },
    createPackage(selectedModule, packageObj, mode) {
      this.selectedModule = selectedModule
      this.packageForm.id = packageObj ? packageObj.id : null
      this.packageForm.name = packageObj ? packageObj.name : ''
      this.packageForm.features = packageObj ? packageObj.features : []
      this.packageForm.price = packageObj ? packageObj.price : 0.0
      this.packageForm.available_module_id = selectedModule.id
      this.mode = mode
      this.dialogVisible = true
    },
    updatePackage() {
      const savePackageResource = new Resource('packages/update')
      const param = this.packageForm
      savePackageResource
        .update(param.id, param)
        .then(() => {
          this.$message('Package is updated successfully')
          this.fetchPackages(false)
        })
        .catch(() => {
          this.loading = false
        })
    },
    submitPackage() {
      this.loading = true
      const savePackageResource = new Resource('packages/store')
      const param = this.packageForm
      savePackageResource
        .store(param)
        .then(() => {
          this.$message('Package is created successfully')
          this.loading = false
          this.fetchPackages()
        })
        .catch(() => {
          this.loading = false
        })
    },
    deletePackage(pack) {
      app
        .$confirm(`${pack.name} will be removed from the list of packages. Continue?`, 'Warning', {
          confirmButtonText: 'Yes, Continue',
          cancelButtonText: 'No',
          type: 'warning'
        })
        .then(() => {
          this.loading = true
          const savePackageResource = new Resource('packages/destroy')
          savePackageResource
            .destroy(pack.id)
            .then(() => {
              this.$message('Package is removed successfully')
              this.loading = false
              this.fetchPackages()
            })
            .catch(() => {
              this.loading = false
            })
        })
        .catch()
    },
    updateTable() {
      this.fetchPackages()
    },
    addModule(selectedRow) {
      // console.log(props)

      // const editableRow = selected_row;
      this.selectedModule = selectedRow
      this.isCreatePackageModuleSidebarActive = true
    },
    setupModule(row) {
      const moduleSlug = row.slug
      const { id } = row
      this.$router.push({ name: 'ModuleSetup', params: { id, module: moduleSlug } }).catch(() => {})
    },
    removePartnerModule(id) {
      // console.log(props)

      if (window.confirm('Kindly confirm action')) {
        // this.packages = []
        const fetchPackageResource = new Resource('packages/deactivate-partners-module')
        fetchPackageResource.destroy(id).then(() => {
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
