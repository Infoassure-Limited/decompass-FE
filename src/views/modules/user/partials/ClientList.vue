<template>
  <div>
    <div>
      <el-row>
        <el-col :md="21">
          <h3> Registered Clients </h3>
        </el-col>
        <el-col :md="3">
          <el-button
            v-if="checkPermission(['create-clients'])"
            type="primary"
            @click="registerDialog = true"
            >New Registration</el-button
          >
        </el-col>
      </el-row>
      <hr />
      <!-- <span class="pull-right">
        <el-button
          v-if="clients.length > 0"
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="document"
          @click="handleDownload('List of Clients', clients)"
        >Export Excel</el-button>
      </span> -->
      <v-client-table :data="clients" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:child_row="props">
          <div>
            <el-alert type="error" :closable="false">
              Privileged users for {{ props.row.name }}
            </el-alert>
            <v-client-table
              :data="props.row.users"
              :columns="['name', 'user_status', 'action']"
              :options="{ filterable: false }"
            >
              <template v-slot:name="{ row }">
                <div>
                  <strong>{{ row.name }}</strong> <br />
                  {{ row.email }} <br />
                  {{ row.phone }}
                </div>
              </template>
              <template v-slot:user_status="{ row }">
                <div>
                  <el-tooltip
                    v-if="props.row.admin_user_id !== row.id"
                    :content="`Make ${row.name} the company's admin`"
                    placement="top"
                  >
                    <el-button type="info" circle @click="makeAdmin(props.row.id, row)">
                      <icon icon="tabler:user-check" />
                    </el-button>
                  </el-tooltip>
                  <el-alert v-else type="success" :closable="false"> Administrator </el-alert>
                </div>
              </template>
              <template v-slot:action="{ row }">
                <el-button-group class="ml-4">
                  <el-tooltip :content="`Edit ${row.name}'s info`" placement="top">
                    <el-button type="primary" plain @click="editThisClientUser(row)">
                      <icon icon="tabler:edit" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Activate Account" placement="top">
                    <el-button
                      type="primary"
                      plain
                      @click="confirmRegistration(row.id, 'admin_confirmation')"
                    >
                      <icon icon="tabler:check" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Send login credentials" placement="top">
                    <el-button type="primary" plain @click="sendLoginCredentials(row)">
                      <icon icon="tabler:key" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Delete User" placement="top">
                    <el-button type="primary" plain @click="deleteClientUser(props.row.id, row.id)">
                      <icon icon="tabler:trash" />
                    </el-button>
                  </el-tooltip>
                </el-button-group>
              </template>
            </v-client-table>
          </div>
        </template>
        <template v-slot:is_active="{ row }">
          <div>
            {{ row.is_active === 1 ? 'Active' : 'Suspended' }}
          </div>
        </template>
        <template v-slot:action="props">
          <div>
            <el-dropdown>
              <el-button type="info" plain> Action <icon icon="tabler:chevron-down" /> </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="checkPermission(['update-clients'])"
                    @click="editClient(props.row)"
                  >
                    <span><icon icon="tabler:edit" /> Edit</span>
                  </el-dropdown-item>

                  <el-dropdown-item
                    v-if="checkRole(['super']) && props.row.is_active === 0"
                    @click="toggleClientSuspension(props.row, 1, 'activate')"
                  >
                    <span><icon icon="tabler:lock-open-2" /> Activate</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkRole(['super']) && props.row.is_active === 1"
                    @click="toggleClientSuspension(props.row, 0, 'suspend')"
                  >
                    <span><icon icon="tabler:lock-password" /> Suspend</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </v-client-table>
      <el-row :gutter="20">
        <pagination
          v-show="total > 0"
          :total="total"
          v-model:page="query.page"
          v-model:limit="query.limit"
          @pagination="fetchClients"
        />
      </el-row>
    </div>
    <el-dialog v-model="registerDialog" title="Register New Client">
      <RegisterClient @saved="fetchClients" />
    </el-dialog>
    <el-dialog
      v-if="showEditClientForm"
      v-model="showEditClientForm"
      :title="`Edit ${selectedClient.name}`"
    >
      <EditClient :selected-client="selectedClient" @update="fetchClients()" />
    </el-dialog>
    <el-dialog
      v-if="showEditClientUserForm"
      v-model="showEditClientUserForm"
      :title="`Edit ${selectedClientUser.name}`"
    >
      <EditClientUser :selected-client-user="selectedClientUser" @update="fetchClients()" />
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import RegisterClient from './RegisterClient.vue'
import EditClient from './EditClient.vue'
import EditClientUser from './EditClientUser.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Pagination,
    EditClient,
    EditClientUser,
    RegisterClient
  },
  data() {
    return {
      downloadLoading: false,
      editClientUser: false,
      registerDialog: false,
      showEditClientForm: false,
      showEditClientUserForm: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'contact_email',
        'contact_phone',
        'contact_address',
        'is_active',
        'action'
        // 'user.password_status',
      ],

      options: {
        headings: {
          contact_email: 'Email',
          contact_phone: 'Phone',
          contact_address: 'Address',
          is_active: 'Status',
          action: ''

          // id: 'S/N',
        },
        filterByColumn: false,
        rowAttributesCallback(row) {
          if (row.is_active === 0) {
            return { style: 'background: #d83b3beb; color: #000000' }
          }
          return {}
        },
        sortable: ['name', 'contact_email', 'contact_phone'],
        // filterable: false,
        filterable: ['name', 'contact_email', 'contact_phone']
      },
      showEditForm: false,
      clients: [],
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
    this.fetchClients()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchClients() {
      const { limit, page } = this.query
      this.loading = true
      const fetchStaffResource = new Resource('clients')
      fetchStaffResource.list(this.query).then((response) => {
        this.clients = response.clients.data
        this.clients.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = response.clients.total
        this.loading = false
      })
    },
    makeAdmin(clientId, user) {
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
          const clientResource = new Resource('clients/assign-user-as-client-admin')
          clientResource
            .update(clientId, { user_id: user.id })
            .then(() => {
              this.$message({
                type: 'success',
                message: 'Action Successfully'
              })
              this.loading = false
              this.fetchClients()
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
            this.fetchClients()
          })
        })
        .catch((error) => {
          this.$message({
            type: 'error',
            message: error.response.data.message
          })
        })
    },
    confirmRegistration(userId, code) {
      const confirmCodeResource = new Resource('auth/confirm-registration')
      this.loading = true
      confirmCodeResource.list({ code, user_id: userId }).then((response) => {
        this.$message({
          type: 'success',
          message: response
        })
        this.loading = false
      })``.catch((error) => {
        // console.log(error.response)
        this.$message.error(error.response.data.message || 'An error occured. Please try again')
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
    deleteClientUser(clientId, userId) {
      this.$confirm(
        'Are you sure you want to remove this user from this client?',
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('clients/delete-client-user')
          deleteStaffResource.update(clientId, { user_id: userId }).then(() => {
            this.fetchClients()
            this.$message({
              type: 'success',
              message: 'Action Successful'
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
    editClient(value) {
      this.selectedClient = value
      this.showEditClientForm = true
    },
    editThisClientUser(row) {
      this.selectedClientUser = row
      this.showEditClientUserForm = true
    },
    handleDownload(tableTitle, clientsList) {
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
        const list = clientsList
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
