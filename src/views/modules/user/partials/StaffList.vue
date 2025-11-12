<template>
  <div>
    <div>
      <el-row>
        <el-col :md="21">
          <h3> Registered Staff </h3>
        </el-col>
        <!-- <el-col :md="3">
          <el-button type="primary" @click="registerDialog = true">New Registration</el-button>
        </el-col> -->
      </el-row>
      <hr />
    </div>
    <div>
      <!-- <span class="pull-right">
        <el-button
          v-if="staff.length > 0"
          :loading="downloadLoading"
          style="margin:0 0 20px 20px;"
          type="primary"
          icon="document"
          @click="handleDownload('List of Staff', staff)"
        >Export Excel</el-button>
      </span> -->
      <v-client-table :data="staff" v-loading="loading" :columns="columns" :options="options">
        <template v-slot:action="props">
          <div>
            <el-dropdown>
              <el-button type="info" plain> Action <icon icon="tabler:chevron-down" /> </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>
                    <a :to="{ name: 'staffDetails', params: { id: props.row.id } }">
                      <span><icon icon="tabler:eye" /> View Details</span>
                    </a>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="editStaff(props.row)"><icon icon="tabler:edit" /> Edit</span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="resetPassword(props.row.user)">
                      <icon icon="tabler:lock-password" /> Reset Password
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="loginAsUser(props.row.user)">
                      <icon icon="tabler:key" /> Login
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item>
                    <span @click="removeStaff(props.row)">
                      <icon icon="tabler:trash" /> Delete
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </v-client-table>
    </div>
    <el-dialog v-model="registerDialog" title="Register New Staff">
      <RegisterStaff @saved="fetchStaff" />
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import RegisterStaff from './RegisterStaff.vue'
export default {
  components: {
    RegisterStaff
  },
  data() {
    return {
      downloadLoading: false,
      registerDialog: false,
      pageLength: 10,
      dir: false,
      columns: [
        'name',
        'email',
        'phone'
        // 'action'
        // 'user.password_status',
      ],

      options: {
        headings: {
          action: ''

          // id: 'S/N',
        },
        filterByColumn: true,
        sortable: ['name', 'email', 'phone'],
        // filterable: false,
        filterable: ['name', 'email', 'phone']
      },
      staff: [],
      loading: false,
      selectedClient: null,
      selected_row_index: '',
      query: {
        page: 1,
        limit: 50
      },
      total: 0
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    fetchStaff() {
      this.loading = true
      const fetchUsersResource = new Resource('users/fetch-staff')
      fetchUsersResource.list().then((response) => {
        this.staff = response.staff
        this.loading = false
      })
    },
    async loginAsUser(user) {
      await this.$store.dispatch('user/loginAsUser', { user_id: user.id })
      // this.$router.push('/login').catch(() => {})
      window.location = '/'
    },
    resetPassword(user) {
      const param = {
        user_id: user.id
      }
      app
        .$confirm(
          `This will change the password for ${user.username}. Do you want to continue?`,
          'Confirm Action',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        .then(() => {
          this.loading = true
          const resetPasswordResource = new Resource('user-setup/admin-reset/password')
          resetPasswordResource.list(param).then(() => {
            this.$alert(
              `Password for ${user.username} has been reset to: password `,
              'Password Reset',
              {
                confirmButtonText: 'OK'
              }
            )
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
    approve(user) {
      app
        .$confirm(
          `This will activate ${user.username}'s account. Do you want to continue?`,
          'Confirm Activation',
          {
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            type: 'warning'
          }
        )
        .then(() => {
          this.loading = true
          const resetPasswordResource = new Resource('user-setup/approve-user')
          resetPasswordResource.update(user.id).then(() => {
            this.$alert('Account activation successful', 'Successful', {
              confirmButtonText: 'OK'
            })
            this.reloadTable()
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
    editStaff(value) {
      // console.log(props)

      this.selectedClient = value
    },
    reloadTable() {
      this.selectedClient = null
      this.fetchStaff()
    },
    removeStaff(staff) {
      this.$confirm(
        `This will delete ${staff.user.username} from the portal. It cannot be undone. Do you want to continue?`,
        'Confirm Action',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          this.loading = true
          const deleteStaffResource = new Resource('user-setup/staff/destroy')
          deleteStaffResource.destroy(staff.id).then(() => {
            this.reloadTable()
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
    handleDownload(tableTitle, staffList) {
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
        const list = staffList
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
          if (j === 'last_name') {
            return v.user.last_name
          }
          if (j === 'first_name') {
            return v.user.first_name
          }
          if (j === 'email') {
            return v.user.email
          }
          if (j === 'phone1') {
            return v.user.phone1
          }
          if (j === 'gender') {
            return v.user.gender
          }

          return v[j]
        })
      )
    }
  }
}
</script>
