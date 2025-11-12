<template>
  <div>
    <div>
      <el-row>
        <el-col :md="21">
          <h3> Registered Partners </h3>
        </el-col>
        <el-col :md="3">
          <el-button type="primary" @click="registerDialog = true">New Registration</el-button>
        </el-col>
      </el-row>
      <hr />
      <!-- <span class="pull-right">
        <el-button
          v-if="partners.length > 0"
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="document"
          @click="handleDownload('List of Partners', partners)"
        >Export Excel</el-button>
      </span> -->
      <v-client-table :data="partners" :columns="columns" :options="options">
        <template v-slot:child_row="props">
          <div>
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
                  <strong>{{ row.name }}</strong> <br />
                  {{ row.email }} <br />
                  {{ row.phone }}
                </div>
              </template>
              <template v-slot:action="{ row }">
                <div>
                  <el-tooltip :content="`Edit ${row.name}'s info`" placement="top">
                    <el-button circle type="primary" @click="editThisPartnerUser(row)">
                      <icon icon="tabler:edit" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Activate Account" placement="top">
                    <el-button
                      circle
                      type="success"
                      @click="confirmRegistration(row.id, 'admin_confirmation')"
                    >
                      <icon icon="tabler:check" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Send login credentials" placement="top">
                    <el-button circle type="warning" @click="sendLoginCredentials(row)">
                      <icon icon="tabler:key" />
                    </el-button>
                  </el-tooltip>
                  <el-tooltip content="Delete User" placement="top">
                    <el-button
                      circle
                      type="danger"
                      @click="deletePartnerUser(props.row.id, row.id)"
                    >
                      <icon icon="tabler:trash" />
                    </el-button>
                  </el-tooltip>
                </div>
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
            <el-dropdown class="mx-1" right text="Action">
              <el-button type="info"> Action <icon icon="tabler:chevron-down" /> </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="checkPermission(['update-partners'])"
                    @click="editPartner(props.row)"
                  >
                    <span><icon icon="tabler:edit" /> Edit</span>
                  </el-dropdown-item>

                  <el-dropdown-item
                    v-if="checkRole(['super']) && props.row.is_active === 0"
                    @click="togglePartnerSuspension(props.row, 1, 'activate')"
                  >
                    <span><icon icon="tabler:lock-open-2" /> Activate</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="checkRole(['super']) && props.row.is_active === 1"
                    @click="togglePartnerSuspension(props.row, 0, 'suspend')"
                  >
                    <span><icon icon="tabler:lock-exclamation" /> Suspend</span>
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
          @pagination="fetchPartners"
        />
      </el-row>
    </div>
    <el-dialog v-model="registerDialog" title="Register New User">
      <PartnerRegistration @saved="fetchPartners" />
    </el-dialog>
    <el-dialog
      v-if="showEditPartnerForm"
      v-model="showEditPartnerForm"
      :title="`Edit ${selectedPartner.name}`"
    >
      <EditPartner :selected-partner="selectedPartner" @update="fetchPartners()" />
    </el-dialog>
    <el-dialog
      v-if="editPartnerUser"
      v-model="editPartnerUser"
      :title="`Edit ${selectedPartnerUser.name}`"
    >
      <EditPartnerUser :selected-partner-user="selectedPartnerUser" @update="fetchPartners()" />
    </el-dialog>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import checkRole from '@/utils/role'
import Pagination from '@/views/Components/Pagination-main/index.vue'
import Resource from '@/api/resource'
import PartnerRegistration from './RegisterPartner.vue'
import EditPartner from './EditPartner.vue'
import EditPartnerUser from './EditPartnerUser.vue'

export default {
  components: {
    Pagination,
    EditPartner,
    EditPartnerUser,
    PartnerRegistration
  },
  data() {
    return {
      downloadLoading: false,
      showEditPartnerForm: false,
      editPartnerUser: false,
      registerDialog: false,
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
      partners: [],
      loading: false,
      selectedPartner: null,
      selectedPartnerUser: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50
      },
      total: 0
    }
  },
  created() {
    this.fetchPartners()
  },
  methods: {
    checkPermission,
    checkRole,
    fetchPartners() {
      const { limit, page } = this.query
      this.loading = true
      this.registerDialog = false
      const fetchStaffResource = new Resource('partners')
      fetchStaffResource
        .list(this.query)
        .then((response) => {
          this.partners = response.partners.data
          this.partners.forEach((element, index) => {
            element['index'] = (page - 1) * limit + index + 1
          })
          this.total = response.partners.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
          // this.$message({
          //   type: 'info',
          //   message: 'Delete canceled',
          // })
        })
    },
    togglePartnerSuspension(partner, value, action) {
      this.$confirm(
        `Are you sure you want to ${action} ${partner.name}
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
          const partnerResource = new Resource('partners/toggle-partner-suspension')
          partnerResource.update(partner.id, { value }).then(() => {
            this.$message({
              type: 'success',
              message: 'Action Successfully'
            })
            this.loading = false
            this.fetchPartners()
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
          const deleteStaffResource = new Resource('partners/send-login-credentials')
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
    deletePartnerUser(partnerId, userId) {
      this.$confirm(
        'Are you sure you want to remove this user from this partner?',
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('partners/delete-partner-user')
          deleteStaffResource.update(partnerId, { user_id: userId }).then(() => {
            this.fetchPartners()
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
    editPartner(value) {
      // console.log(props)

      this.selectedPartner = value
      this.showEditPartnerForm = true
    },
    editThisPartnerUser(row) {
      this.selectedPartnerUser = row
      this.showEditForm = true
      this.editPartnerUser = true
    },
    handleDownload(tableTitle, partnersList) {
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
        const list = partnersList
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
