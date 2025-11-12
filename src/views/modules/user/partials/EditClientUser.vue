<template>
  <div class="auth-wrapper auth-v2">
    <el-row :gutter="10">
      <el-col :md="24">
        <v-text-field variant="outlined" id="name" v-model="form.name" label="Enter Full Name" />
      </el-col>
      <el-col :md="24">
        <v-text-field
          variant="outlined"
          id="email"
          v-model="form.email"
          label="Enter Email Address"
        />
      </el-col>
      <el-col :md="24">
        <v-text-field
          variant="outlined"
          id="phone"
          v-model="form.phone"
          label="Enter Phone Number"
        />
      </el-col>
      <el-col :md="24">
        <v-text-field
          variant="outlined"
          id="phone2"
          v-model="form.designation"
          label="Your designation at work"
        />
      </el-col>
      <el-col :md="24">
        <el-button type="success" @click="formSubmitted"> Submit </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { required } from '@validations'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedClientUser: {
      type: Object,
      default: () => null
    }
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      form: {
        id: '',
        name: '',
        email: '',
        phone: '',
        designation: '',
        required
      },
      genders: ['Male', 'Female']
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  created() {
    this.setFormProperties(this.selectedClientUser)
  },
  methods: {
    setFormProperties(selectedClient) {
      this.form = selectedClient
    },
    formSubmitted() {
      const registerResource = new Resource('clients/update-client-user')
      const { form } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .update(form.id, form)
        .then(() => {
          this.loader = false
          this.$message(`Client's information updated`)

          //this.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          //this.$alert(`<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`, 'Confirmation Link Sent', {
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
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
