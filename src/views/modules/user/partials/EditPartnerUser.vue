<template>
  <el-row :gutter="20">
    <el-col :md="12">
      <v-text-field id="name" v-model="form.name" label="Full Name" placeholder="Enter Full Name" />
    </el-col>
    <el-col :md="12">
      <v-text-field
        id="email"
        v-model="form.email"
        placeholder="Enter Email Address"
        label="Valid Email"
      />
    </el-col>
    <el-col :md="12">
      <v-text-field
        id="phone"
        v-model="form.phone"
        label="Phone Number"
        placeholder="Enter Phone Number"
      />
    </el-col>
    <el-col :md="12">
      <v-text-field
        id="phone2"
        v-model="form.designation"
        placeholder="Your designation at work"
        label="Designation"
      />
    </el-col>
    <el-col :md="12">
      <el-button type="success" @click="formSubmitted"> Update </el-button>
    </el-col>
  </el-row>
</template>

<script>
import Resource from '@/api/resource'

export default {
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
        designation: ''
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
          this.$message("Client's information updated", 'Success', {
            type: 'success',
            duration: 5000
          })

          // this.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          // this.$alert(`<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`, 'Confirmation Link Sent', {
          //   dangerouslyUseHTMLString: true,
          // })
          // this.$router.push({ path: '/login' })
          // send mail
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
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
