<template>
  <div class="auth-wrapper auth-v2">
    <div class="align-text-center">
      <h3>User Information</h3>
    </div>
    <el-row :gutter="10">
      <el-col :md="12">
        <v-text-field
          v-model="form.name"
          :readonly="loader"
          class="mb-2"
          label="Full Name"
          placeholder="John Doe"
          variant="outlined"
          :error-messages="v$.form.name.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          v-model="form.email"
          :readonly="loader"
          class="mb-2"
          label="Valid Email"
          placeholder="johndoe@example.com"
          variant="outlined"
          :error-messages="v$.form.email.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          v-model="form.phone"
          :readonly="loader"
          class="mb-2"
          label="Enter Phone Number"
          placeholder="08012345678"
          variant="outlined"
          :error-messages="v$.form.phone.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          v-model="form.designation"
          :readonly="loader"
          class="mb-2"
          label="Your designation at work"
          placeholder="CTO"
          variant="outlined"
          :error-messages="v$.form.designation.$errors.map((e) => e.$message)"
        />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <v-btn
          :disabled="loader"
          :loading="loader"
          color="green"
          size="x-large"
          variant="flat"
          block
          @click="validationFormInfo"
        >
          Update
        </v-btn>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email } from '@validations'
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    selectedVendorUser: {
      type: Object,
      default: () => null
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    const maxDate = new Date()
    return {
      form: {
        id: '',
        name: '',
        email: '',
        phone: '',
        designation: ''
      },
      loader: false
    }
  },
  validations() {
    return {
      form: {
        name: { required },
        email: { required, email },
        phone: { required },
        designation: { required }
      }
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  mounted() {
    this.setFormProperties(this.selectedVendorUser)
  },
  methods: {
    setFormProperties(selectedVendor) {
      this.form = selectedVendor
    },
    formSubmitted() {
      const registerResource = new Resource('vdd/update-vendor-user')
      const { form } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .update(form.id, form)
        .then(() => {
          this.loader = false
          this.$emit('updated')
          this.$message({
            message: 'Data updated',
            type: 'success'
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
          this.$message({
            message: error.response.data.message,
            type: 'danger'
          })

          this.loader = false
        })
    },
    async validationFormInfo() {
      const success = await this.v$.$validate()
      if (success) {
        this.formSubmitted()
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
