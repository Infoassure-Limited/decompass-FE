<template>
  <el-row class="auth-inner m-0">
    <!-- Login-->
    <el-col v-loading="loader" lg="12" class="align-items-center auth-bg px-2 p-lg-2">
      <div class="mel-1 font-weight-bold" title-tag="h2">
        <h4>Kindly fill the form below to register a user</h4>
      </div>
      <el-row>
        <el-col :md="24">
          <el-select id="client_id" v-model="clientUserform.client_id" style="width: 100%">
            <el-option
              v-for="(client, index) in clients"
              :key="index"
              :value="client.id"
              :label="client.name"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="mt-2">
        <el-col :md="12">
          <v-text-field
            variant="outlined"
            id="first_name"
            v-model="clientUserform.admin_first_name"
            label="First Name"
          />
        </el-col>
        <el-col :md="12">
          <v-text-field
            variant="outlined"
            id="last_name"
            v-model="clientUserform.admin_last_name"
            label="Last Name"
          />
        </el-col>
        <el-col :md="24">
          <small>
            <em>On successful registration a notification will be sent to this e-mail</em>
          </small>
          <v-text-field
            variant="outlined"
            id="email"
            v-model="clientUserform.email"
            label="Email Address"
          />
        </el-col>
        <el-col :md="24">
          <v-text-field
            variant="outlined"
            id="phone"
            v-model="clientUserform.phone"
            label="Phone Number"
          />
        </el-col>
        <el-col :md="24">
          <v-text-field
            variant="outlined"
            id="phone2"
            v-model="clientUserform.designation"
            label="Designation at work"
          />
        </el-col>
        <el-col :md="24">
          <el-button type="success" @click="submitClientUser"> Submit </el-button>
        </el-col>
      </el-row>
    </el-col>
    <!-- /Login-->
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      clients: [],
      form: {
        client_id: '',
        user_id: ''
      },
      clientUserform: {
        client_id: '',
        admin_first_name: '',
        admin_last_name: '',
        email: '',
        phone: '',
        designation: '',
        role: 'user',
        login_as: 'user'
      },
      empty_clientUserform: {
        client_id: '',
        admin_first_name: '',
        admin_last_name: '',
        email: '',
        phone: '',
        designation: '',
        role: 'user',
        login_as: 'user'
      },
      users: [],
      genders: ['Male', 'Female'],
      loader: false
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  created() {
    this.fetchClients()
    this.fetchClientUsers()
  },
  methods: {
    fetchClients() {
      const fetchClientResource = new Resource('clients')
      fetchClientResource.list({ option: 'all' }).then((response) => {
        this.clients = response.clients
        this.clientUserform.client_id = this.clients[0].id
      })
    },
    fetchClientUsers() {
      const fetchPartnerResource = new Resource('users/fetch-client-users')
      fetchPartnerResource.list().then((response) => {
        this.users = response.users
      })
    },
    attachClientUser() {
      const fetchPartnerResource = new Resource('clients/attach-client-user')
      fetchPartnerResource.update(this.form.client_id, { user_id: this.form.user_id }).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'User Attached Successful',
            icon: 'CheckIcon',
            variant: 'success'
          }
        })
      })
    },
    submitClientUser() {
      const registerResource = new Resource('clients/register-client-user')
      const { clientUserform } = this
      this.loader = true
      const { email } = this.clientUserform
      registerResource
        .store(clientUserform)
        .then(() => {
          this.$alert(`A confirmation link has been sent to ${email}`)
          this.$emit('saved')
          this.clientUserform = this.empty_clientUserform
          this.loader = false
          this.$message('Client User Registration Successful')
        })
        .catch((error) => {
          console.log(error)
          this.$toast({
            component: ToastificationContent,
            props: {
              title: error.response.data.message,
              icon: 'XOctagonIcon',
              variant: 'danger'
            }
          })

          this.loader = false
        })
    },
    validationFormAdministrator() {
      return new Promise((resolve, reject) => {
        this.$refs.administratorRules.validate().then((success) => {
          if (success) {
            resolve(true)
          } else {
            reject()
          }
        })
      })
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
