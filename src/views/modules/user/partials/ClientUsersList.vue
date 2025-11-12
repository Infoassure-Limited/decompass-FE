<template>
  <div>
    <div v-loading="loading">
      <el-row>
        <el-col :md="21">
          <h3> Registered Users </h3>
        </el-col>
        <el-col :md="3">
          <el-button
            v-if="checkPermission(['create-client-user'])"
            type="primary"
            @click="registerDialog = true"
            >New Registration</el-button
          >
        </el-col>
      </el-row>
      <hr />
      <!-- <span class="pull-right">
          <el-button
            v-if="users.length > 0"
            :loading="downloadLoading"
            style="margin:0 0 20px 20px;"
            type="primary"
            icon="document"
            @click="handleDownload('List of Clients', users)"
          >Export Excel</el-button>
        </span> -->
      <v-client-table :data="users" :columns="columns" :options="options">
        <template v-slot:is_active="{ row }">
          <div>
            {{ row.is_active === 1 ? 'Active' : 'Suspended' }}
          </div>
        </template>
        <template v-slot:assign="{ row }">
          <el-button-group v-if="checkRole(['admin'])">
            <!-- <el-button @click="grantPermissionToUser(row)">
              <icon icon="tabler:user" /> Role
            </el-button> -->
            <el-button type="success" @click="grantPermissionToUser(row)">
              <icon icon="tabler:key" /> Privileges
            </el-button>
          </el-button-group>
        </template>
        <template v-slot:action="{ row }">
          <div>
            <el-button-group>
              <el-tooltip
                v-if="checkPermission(['create-client-user']) && row.email_verified_at === null"
                content="Activate Account"
                placement="top"
              >
                <el-button @click="confirmRegistration(row.id, 'admin_confirmation')">
                  <icon icon="tabler:check" color="green" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="checkPermission(['update-client-user']) && row.is_client_admin === 0"
                :content="`Edit ${row.name}'s info`"
                placement="top"
              >
                <el-button @click="editThisClientUser(row)">
                  <icon icon="tabler:edit" color="orange" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="row.is_client_admin === 0"
                content="Send new login credentials"
                placement="top"
              >
                <el-button @click="sendLoginCredentials(row)">
                  <icon icon="tabler:lock-password" />
                </el-button>
              </el-tooltip>
              <el-tooltip
                v-if="checkPermission(['delete-client-user']) && row.is_client_admin === 0"
                :content="`Delete ${row.name}'s account`"
                placement="top"
              >
                <el-button @click="deleteClientUser(row)">
                  <icon icon="tabler:trash" color="red" />
                </el-button>
              </el-tooltip>
            </el-button-group>
          </div>
        </template>
      </v-client-table>
      <!-- <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.limit"
          @pagination="fetchClientUsers"
        />
      </el-row> -->
    </div>
    <!-- <el-row>
      <el-col cols="7">
        <h3> Edit Client </h3>
      </el-col>
      <el-col cols="3">
        <span class="pull-right">
          <el-button
            style="margin: 0 0 20px 20px"
            type="danger"
            icon="el-icon-back"
            @click="(fetchClientUsers(), (showEditForm = false))"
            >Back</el-button
          >
        </span>
      </el-col>
    </el-row> -->

    <el-dialog v-model="registerDialog" title="Register New User" @closed="updateTable">
      <RegisterUserClient @saved="fetchClientUsers" />
    </el-dialog>
    <el-dialog v-model="editClientUser" title="Edit User" @closed="updateTable">
      <edit-client-user
        v-if="editClientUser"
        :selected-client-user="selectedClientUser"
        @update="fetchClientUsers()"
      />
    </el-dialog>
    <el-dialog
      :title="`Grant Privileges to ${selectedClientUser.name}`"
      width="80%"
      v-if="showGrantPermissionModal"
      v-model="showGrantPermissionModal"
      @closed="updateTable"
    >
      <div style="min-height: 500px; max-height: 500px">
        <el-tabs type="border-card" stretch>
          <el-tab-pane label="Assign Roles">
            <AssignUserRoles
              v-if="showGrantPermissionModal"
              :user="selectedClientUser"
              :permissions="permissions"
            />
          </el-tab-pane>
          <el-tab-pane label="Grant Specific Permissions">
            <AssignUserPermissions
              v-if="showGrantPermissionModal"
              :user="selectedClientUser"
              :permissions="permissions"
            />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
    <!-- <el-dialog v-model="editClient" title="Edit">
      <EditClient
        v-if="!editClientUser"
        :selected-client="selectedClient"
        @update="fetchClientUsers()"
      />
    </el-dialog> -->
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
// import Pagination from '@/views/components/Pagination-main/index.vue'
import RegisterUserClient from './RegisterUserClient.vue'
// import EditClient from './EditClient.vue'
import EditClientUser from './EditClientUser.vue'
import Resource from '@/api/resource'
import AssignUserRoles from '@/views/modules/settings/partials/access-control/partials/AssignUserRoles.vue'
import AssignUserPermissions from '@/views/modules/settings/partials/access-control/partials/AssignUserPermissions.vue'

export default {
  components: {
    // EditClient,
    EditClientUser,
    RegisterUserClient,
    AssignUserRoles,
    AssignUserPermissions
  },
  data() {
    return {
      registerDialog: false,
      downloadLoading: false,
      editClientUser: false,
      isCreateClassSidebarActive: false,
      isEditClassSidebarActive: false,
      showGrantPermissionModal: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'email',
        'phone',
        // 'designation',
        'assign',
        'action'
        // 'user.password_status',
      ],

      options: {
        headings: {
          action: '',
          assign: 'Assign'

          // id: 'S/N',
        },
        filterByColumn: false,
        rowAttributesCallback(row) {
          if (row.email_verified_at === null) {
            return { style: 'background: #f9ccd1; color: #000000' }
          }
          return {}
        },
        sortable: ['name', 'email', 'phone'],
        // filterable: false,
        filterable: ['name', 'email', 'phone']
      },
      showEditForm: false,
      users: [],
      roles: [],
      permissions: [],
      loading: false,
      selectedClient: null,
      selectedClientUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50
      },
      total: 0
    }
  },
  created() {
    this.fetchClientUsers()
    this.fetchPermissions()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchPermissions() {
      const fetchPermissionResource = new Resource('acl/permissions/index')
      fetchPermissionResource.list().then((response) => {
        this.permissions = response.permissions
      })
    },
    grantPermissionToUser(user) {
      this.selectedClientUser = user
      this.showGrantPermissionModal = true
    },
    fetchClientUsers() {
      // const { limit, page } = this.query
      this.registerDialog = false
      this.editClientUser = false
      this.loading = true
      const fetchStaffResource = new Resource('clients/users')
      fetchStaffResource.list(this.query).then((response) => {
        this.users = response.users
        //   this.users = response.users.data
        //   this.users.forEach((element, index) => {
        //     // eslint-disable-next-line no-param-reassign, dot-notation
        //     element['index'] = (page - 1) * limit + index + 1
        //   })
        //   this.total = response.users.total
        this.loading = false
      })
    },
    toggleClientSuspension(client, value, action) {
      this.$confirm(
        `Are you sure you want to ${action} ${client.name}
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
          const clientResource = new Resource('clients/toggle-client-suspension')
          clientResource.update(client.id, { value }).then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully'
            })
            this.loading = false
            this.fetchClientUsers()
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
      const confirmCodeResource = new Resource('auth/confirm-registration')
      this.loading = true
      confirmCodeResource
        .list({ code, user_id: userId })
        .then((response) => {
          this.fetchClientUsers()
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
          const deleteStaffResource = new Resource('clients/send-login-credentials')
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
    deleteClientUser(user) {
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
          const deleteStaffResource = new Resource('clients/delete-client-user')
          deleteStaffResource
            .destroy(user.id)
            .then(() => {
              this.fetchClientUsers()
              this.$message({
                type: 'success',
                message: 'Action Successful'
              })
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
              this.$message({
                type: 'error',
                message: error.response.data.error || error.response.data.message
              })
            })
        })
        .catch(() => {
          this.loading = false
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    editClient(value) {
      // console.log(props)

      this.selectedClient = value
      this.showEditForm = true
    },
    editThisClientUser(row) {
      this.selectedClientUser = row
      this.showEditForm = true
      this.editClientUser = true
    },
    updateTable() {
      this.fetchClientUsers()
    },
    handleDownload(tableTitle, usersList) {
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
        const list = usersList
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
