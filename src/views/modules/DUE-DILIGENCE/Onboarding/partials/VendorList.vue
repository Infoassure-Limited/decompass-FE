<template>
  <div>
    <div v-loading="loading">
      <el-row :gutter="10">
        <el-col :md="12">
          <h3> Registered Vendors </h3>
        </el-col>
        <el-col :md="12">
          <div class="pull-right">
            <el-button
              v-if="checkPermission(['create-vendor'])"
              type="primary"
              @click="showCreate = true"
              ><Icon icon="tabler:plus" /> Register New</el-button
            >
          </div>
        </el-col>
      </el-row>
      <hr />
      <!-- <span class="pull-right">
          <el-button
            v-if="vendors.length > 0"
            :loading="downloadLoading"
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="document"
            @click="handleDownload('List of Vendors', vendors)"
          >Export Excel</el-button>
        </span> -->
      <v-client-table :data="vendors" :columns="columns" :options="options">
        <template v-slot:child_row="props">
          <div style="max-height: 500px; overflow: auto">
            <el-row :gutter="20">
              <el-col :md="12">
                <el-alert type="success" :closable="false">
                  Privileged users for {{ props.row.name }}
                </el-alert>
                <v-client-table
                  :data="props.row.users"
                  :columns="['name', 'action']"
                  :options="{ filterable: false }"
                >
                  <template v-slot:name="{ row }">
                    <div>
                      <strong>{{ row.name }}</strong>
                      <br />
                      {{ row.email }} <br />
                      {{ row.phone }}
                    </div>
                  </template>
                  <template v-slot:action="{ row }">
                    <div>
                      <el-button-group>
                        <el-tooltip
                          v-if="checkPermission(['update-vendor'])"
                          :content="`Edit ${row.name}'s info`"
                          placement="top"
                        >
                          <el-button @click="editThisVendorUser(row)">
                            <icon icon="tabler:edit" color="orange" />
                          </el-button>
                        </el-tooltip>
                        <el-tooltip
                          v-if="checkPermission(['create-vendor'])"
                          :content="`Send login credentials to ${row.email}`"
                          placement="top"
                        >
                          <el-button @click="sendLoginCredentials(row)">
                            <icon icon="tabler:key" />
                          </el-button>
                        </el-tooltip>
                        <el-tooltip
                          v-if="checkPermission(['delete-vendor'])"
                          :content="`Delete ${row.name}'s profile`"
                          placement="top"
                        >
                          <el-button @click="deleteVendorUser(row)">
                            <icon icon="tabler:trash" color="red" />
                          </el-button>
                        </el-tooltip>
                      </el-button-group>
                    </div>
                  </template>
                </v-client-table>
              </el-col>
              <el-col v-if="checkRole(['admin'])" :md="12">
                <aside>
                  <h4>Assign Staff to {{ props.row.name }}</h4>
                  <el-select
                    v-model="props.row.client_users"
                    placeholder="Select User"
                    multiple
                    filterable
                    value-key="id"
                    collapse-tags
                    style="width: 100%"
                    @change="setVendorUsers(props.row, $event)"
                  >
                    <el-option
                      v-for="(user, index) in client_users"
                      :key="index"
                      :value="user"
                      :label="user.name"
                    />
                  </el-select>
                  <v-client-table
                    v-if="props.row.client_users !== null"
                    :data="props.row.client_users"
                    :columns="['name', 'email']"
                    :options="{ filterable: false }"
                  />
                  <v-client-table
                    v-else
                    :data="empty"
                    :columns="['name', 'email']"
                    :options="{ filterable: false }"
                  />
                </aside>
              </el-col>
            </el-row>
          </div>
        </template>
        <template v-slot:second_approval="{ row }">
          <div>
            <strong>{{
              row.second_approval !== null
                ? row.second_approval.action === 'Approve'
                  ? 'Approved'
                  : 'Rejected'
                : 'Pending'
            }}</strong>
          </div>
        </template>
        <template v-slot:action="props">
          <div v-if="checkPermission(['update-vendor'])">
            <el-button @click="editVendor(props.row)">
              <span><icon icon="tabler:edit" /> Edit</span>
            </el-button>
          </div>
        </template>
      </v-client-table>
      <hr />
      <!-- <el-row :gutter="20">
        <pagination
          v-show="total > 10"
          :total="total"
          v-model:page="query.page"
          v-model:limit="query.limit"
          @pagination="fetchVendors"
        />
      </el-row> -->
    </div>
    <div>
      <el-dialog
        v-model="showCreate"
        title="Register New Vendor"
        size="lg"
        destroy-on-close
        hide-footer
      >
        <vendor-registration @saved="(fetchVendors(), (showCreate = false))" />
      </el-dialog>
      <!-- <el-dialog v-model="showEditForm" title="Edit Vendor" size="lg" destroy-on-close hide-footer>
        <edit-vendor
          :selected-vendor="selectedVendor"
          @updated="(fetchVendors(), (showEditForm = false))"
        />
      </el-dialog> -->
      <el-dialog
        v-model="editVendorUser"
        title="Edit Vendor User"
        size="lg"
        destroy-on-close
        hide-footer
      >
        <edit-vendor-user
          :selected-vendor-user="selectedVendorUser"
          @updated="(fetchVendors(), (editVendorUser = false))"
        />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
// import Pagination from '@/views/Components/Pagination-main/index.vue'
// import OnboardingForm from '@/views/modules/DUE-DILIGENCE/vendor/partials/Onboarding.vue'
import VendorRegistration from './RegisterVendor.vue'
// import EditVendor from './EditVendor.vue'
import EditVendorUser from './EditVendorUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    // Pagination,
    // OnboardingForm,
    VendorRegistration,
    // EditVendor,
    EditVendorUser
  },
  data() {
    return {
      downloadLoading: false,
      editVendorUser: false,
      showCreate: false,
      isEditClassSidebarActive: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'contact_email',
        'contact_phone',
        'contact_address'
        // 'rating',
        // 'second_approval',
        // 'action'
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          second_approval: 'Status',
          action: ''

          // id: 'S/N',
        },
        filterByColumn: false,
        // rowAttributesCallback(row) {
        //   if (row.second_approval === null) {
        //     return { style: 'background: #fcf1c0; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Approve') {
        //     return { style: 'background: #eaf8e5; color: #000000' }
        //   }
        //   if (row.second_approval.action === 'Reject') {
        //     return { style: 'background: #f5dbd3; color: #000000' }
        //   }
        //   return {}
        // },
        sortable: ['name', 'contact_email', 'contact_phone'],
        // filterable: false,
        filterable: ['name', 'contact_email', 'contact_phone']
      },
      showEditForm: false,
      vendors: [],
      loading: false,
      selectedVendor: null,
      selectedVendorUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50
      },
      total: 0,
      empty: [],
      client_users: [],
      selectedClientUsers: []
    }
  },
  computed: {
    selectedClient() {
      return this.$store.getters.selectedClient
    }
  },
  mounted() {
    this.fetchVendors()
    this.fetchClientUsers()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchClientUsers() {
      const clientUsersResource = new Resource('vdd/fetch-client-users')
      clientUsersResource
        .list({ client_id: this.selectedClient.id })
        .then((response) => {
          this.client_users = response.client_users
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    setVendorUsers(vendor, selectedClientUsers) {
      const confirmCodeResource = new Resource('vdd/assign-users-as-vendor-admin')
      confirmCodeResource
        .update(vendor.id, { client_users: selectedClientUsers })
        .then(() => {
          this.fetchVendors(false)
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    fetchVendors(load = true) {
      const { limit, page } = this.query
      this.loading = load
      const fetchStaffResource = new Resource('vdd/fetch-vendors')
      fetchStaffResource.list(this.query).then((response) => {
        this.vendors = response.vendors.data
        this.vendors.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.vendors.total
        this.loading = false
      })
    },
    makeAdmin(vendorId, user) {
      this.$confirm(
        `Please confirm that ${user.name} is the company's new admin?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const vendorResource = new Resource('vendors/assign-user-as-vendor-admin')
          vendorResource
            .update(vendorId, { user_id: user.id })
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Action Successfully'
              })
              this.loading = false
              this.fetchVendors()
            })
            .catch(() => {
              this.loading = false
              this.$message({
                type: 'danger',
                message: 'An error occured. Please try again'
              })
            })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    toggleVendorSuspension(vendor, value, action) {
      this.$confirm(
        `Are you sure you want to ${action} ${vendor.name}
        ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const vendorResource = new Resource('vendors/toggle-vendor-suspension')
          vendorResource.update(vendor.id, { value }).then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully'
            })
            this.loading = false
            this.fetchVendors()
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    confirmRegistration(userId, code) {
      const confirmCodeResource = new Resource('vdd/confirm-registration')
      this.loading = true
      confirmCodeResource
        .list({ code, user_id: userId })
        .then((response) => {
          this.$message({
            type: 'success',
            message: response
          })
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    sendLoginCredentials(user) {
      this.$confirm(
        `Are you sure you want to send login credentials to ${user.email}
        ?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('vdd/send-login-credentials')
          deleteStaffResource.update(user.id).then(() => {
            this.$message({
              type: 'success',
              message: 'Login Credentials Sent Successfully'
            })
            this.loading = false
          })
        })
        .catch(() => {
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    deleteVendorUser(user) {
      this.$confirm(
        `Are you sure you want to delete ${user.name} from the list of users? This cannot be undone.`,
        'Confirm Delete Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('vdd/delete-vendor-user')
          deleteStaffResource.destroy(user.id).then(() => {
            this.fetchVendors()
            this.$message({
              type: 'success',
              message: 'Action Successful'
            })
            this.loading = false
          })
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            type: 'error',
            message: error.response.data.error || error.response.data.message
          })
        })
    },
    editVendor(value) {
      // console.log(props)

      this.selectedVendor = value
      this.showEditForm = true
    },
    editThisVendorUser(row) {
      this.selectedVendorUser = row
      this.showEditForm = true
      this.editVendorUser = true
    },
    handleDownload(tableTitle, vendorsList) {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const multiHeader = [[tableTitle, '', '', '', '', '', '']]
        const tHeader = [
          // 'STUDENTSHIP STATUS',
          'STAFF ID',
          'SURNAME',
          'OTHER NAMES',
          'EMAIL',
          'PHONE',
          'GENDER'
        ]
        const filterVal = [
          // 'studentship_status',
          'user.username',
          'user.last_name',
          'user.first_name',
          'user.email',
          'user.phone1',
          'user.gender'
        ]
        const list = vendorsList
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          multiHeader,
          header: tHeader,
          data,
          filename: tableTitle,
          autoWidth: true,
          bookType: 'csv'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'user.username') {
            return v.user.username
          }
          if (j === 'user.last_name') {
            return v.user.last_name
          }
          if (j === 'user.first_name') {
            return v.user.first_name
          }
          if (j === 'user.email') {
            return v.user.email
          }
          if (j === 'user.phone1') {
            return v.user.phone1
          }
          if (j === 'user.gender') {
            return v.user.gender
          }

          return v[j]
        })
      )
    }
  }
}
</script>
