<template>
  <div class="auth-wrapper auth-v2">
    <el-row class="auth-inner m-0">
      <!-- Login-->
      <el-col v-loading="loader" lg="12" class="align-items-center auth-bg px-2 p-lg-2">
        <div class="mb-1 font-weight-bold" title-tag="h2">
          <h4>Kindly fill the form below to register a partner</h4>
        </div>
        <el-row :gutter="20" class="mt-10">
          <el-col :md="12">
            <v-text-field
              variant="outlined"
              v-model="form.organization_name"
              placeholder="Example Company Ltd."
              label="Name of Organization"
            />
          </el-col>
          <el-col :md="12">
            <v-text-field
              variant="outlined"
              v-model="form.contact_email"
              placeholder="example@domain.com"
              label="Contact Email"
            />
          </el-col>
          <el-col :md="12">
            <v-text-field
              variant="outlined"
              v-model="form.contact_phone"
              placeholder="08012345678"
              label="Contact Phone Number"
            />
          </el-col>
          <el-col :md="12">
            <v-text-field
              variant="outlined"
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
  </div>
</template>

<script>
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      partners: [],
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
      const registerResource = new Resource('partners/register')
      const { form } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(form)
        .then((response) => {
          this.partners.push(response.partner)
          this.form = this.empty_form
          this.loader = false
          this.$message('Partner Registration Successful')

          // this.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          // this.$alert(`<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`, 'Confirmation Link Sent', {
          //   dangerouslyUseHTMLString: true,
          // })
          // this.$router.push({ path: '/login' })
          // send mail
        })
        .catch((error) => {
          console.log(error)
          this.$message(error.response.data.message)

          this.loader = false
        })
    },
    validationFormInfo() {
      return new Promise((resolve, reject) => {
        this.$refs.infoRules.validate().then((success) => {
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
