<template>
  <el-row :gutter="20" class="auth-inner">
    <!-- Login-->
    <el-col v-loading="loader" lg="12" class="align-items-center auth-bg px-2 p-lg-2">
      <div class="mel-1 font-weight-bold" title-tag="h2">
        <h4>Kindly fill the form below to register a client</h4>
      </div>
      <el-row :gutter="20" class="auth-inner">
        <el-col :md="12">
          <v-text-field
            variant="outlined"
            id="name"
            v-model="form.organization_name"
            label="Name of Organization"
            placeholder="Example Company Ltd."
          />
        </el-col>
        <el-col :md="12">
          <v-text-field
            variant="outlined"
            id="email"
            v-model="form.contact_email"
            label="Contact Email"
            placeholder="example@domain.com"
          />
        </el-col>
        <el-col :md="12">
          <v-text-field
            variant="outlined"
            id="phone"
            v-model="form.contact_phone"
            label="Contact Phone Number"
            placeholder="08012345678"
          />
        </el-col>
        <el-col :md="12">
          <v-text-field
            variant="outlined"
            id="website"
            v-model="form.contact_address"
            placeholder="123 Tom Dick and Harry Close, Lagos, Nigeria"
            label="Contact Address"
          />
        </el-col>
        <el-col :md="24">
          <el-button type="success" @click="formSubmitted"> Submit </el-button>
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
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: ''
      },
      empty_form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: ''
      },
      genders: ['Male', 'Female'],
      loader: false
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  created() {},
  methods: {
    formSubmitted() {
      const registerResource = new Resource('clients/register')
      const { form } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(form)
        .then((response) => {
          this.clients.push(response.client)
          this.form = this.empty_form
          this.loader = false
          this.$message('Client Registration Successful', 'Success', {
            type: 'success',
            duration: 5000
          })
        })
        .catch((error) => {
          console.log(error)
          this.$message(error.response.data.message, 'Error', {
            type: 'danger',
            duration: 5000
          })
          this.loader = false
        })
    }
  }
}
</script>
