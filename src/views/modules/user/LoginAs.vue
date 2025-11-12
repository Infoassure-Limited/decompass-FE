<template>
  <div class="auth-wrapper auth-v1 px-2">
    <div class="auth-inner py-2">
      <!-- form -->
      <el-card-title class="mel-1" align="center"> 🔒 Login As </el-card-title>

      <el-form class="auth-forgot-password-form mt-2">
        <div label="Select Role" label-for="forgot-password-email">
          <el-select
            v-model="selectedRole"
            style="width: 100%"
            placeholder="Select Role"
            @change="setRole()"
          >
            <el-option
              v-for="(role, index) in user.all_roles"
              :key="index"
              :value="role"
              :label="role.toUpperCase()"
            />
          </el-select>
          <el-link @click="loadUser()">
            <small>No role displayed? click to reload</small>
          </el-link>
        </div>
        <div v-if="partners.length > 0" label="Select Partner">
          <el-select
            v-model="selectedPartner"
            style="width: 100%"
            placeholder="Select Company"
            @change="loginAs()"
          >
            <el-option
              v-for="(partner, index) in partners"
              :key="index"
              :value="partner.id"
              :label="partner.name"
            />
          </el-select>
        </div>
        <div v-if="clients.length > 0" label="Select Client">
          <el-select
            v-model="selectedClient"
            style="width: 100%"
            placeholder="Select Company"
            @change="loginAs()"
          >
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client.id"
              :label="client.name"
            />
          </el-select>
        </div>
      </el-form>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    // const { resolveUserRoleVariant } = useUsersList()
    return {
      // avatarText,
      // resolveUserRoleVariant,
      selectedRole: '',
      selectedPartner: null,
      selectedClient: null,
      partners: [],
      clients: [],
      dialogVisible: false,
      load: false
    }
  },
  computed: {
    baseServerUrl() {
      return this.$store.getters.baseServerUrl
    },
    user() {
      return this.$store.getters.userData
    }
  },
  created() {
    this.loadUser()
  },
  methods: {
    loadUser() {
      this.load = true
      this.$store.dispatch('user/getInfo')
      setTimeout(() => {
        this.load = false
      }, 2000)
    },
    setRole() {
      this.clients = []
      this.partners = []
      const { selectedRole } = this
      switch (selectedRole) {
        case 'super':
          this.loginAs()
          break
        case 'vendor':
          this.loginAs()
          break
        case 'admin':
          // this.loginAs('admin')
          this.fetchUserClients()
          break
        case 'partner':
          this.fetchUserPartners()
          break
        case 'user':
          this.fetchUserClients()
          break
        default:
          this.fetchUserClients(selectedRole)
          break
      }
    },
    loginAs() {
      this.load = true
      const userResource = new Resource('auth/login-as')
      userResource
        .store({
          partner_id: this.selectedPartner,
          client_id: this.selectedClient,
          vendor_id: this.user.vendor_id,
          role: this.selectedRole
        })
        .then((response) => {
          this.$store.dispatch('user/updateUserData', response.data)
          this.$message('Login Success')

          // we load the browser this once
          window.location = '/dashboard'
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    },
    fetchUserPartners() {
      this.load = true
      const userPartnerResource = new Resource('partners/fetch-user-partners')
      userPartnerResource
        .list()
        .then((response) => {
          this.partners = response.partners
          this.load = false
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    },
    fetchUserClients(selectedRole = null) {
      this.load = true
      const userResource = new Resource('clients/fetch-user-clients')
      userResource
        .list({ role: selectedRole })
        .then((response) => {
          this.clients = response.clients
          this.load = false
        })
        .catch((error) => {
          console.log(error)
          this.load = false
        })
    }
  }
}
</script>
