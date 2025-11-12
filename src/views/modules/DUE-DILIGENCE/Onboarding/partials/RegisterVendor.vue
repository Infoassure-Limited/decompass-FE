<template>
  <div>
    <div class="align-text-center">
      <h3>Company Information</h3>
    </div>
    <el-row :gutter="10">
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.organization_name"
          :readonly="loader"
          class="mb-2"
          label="Name of Organization"
          placeholder="Example Company Ltd."
          variant="outlined"
          :error-messages="v$.form.organization_name.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.contact_email"
          type="email"
          :readonly="loader"
          class="mb-2"
          label="Company Email"
          placeholder="info@companydomain.com"
          variant="outlined"
          :error-messages="v$.form.contact_email.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.contact_phone"
          :readonly="loader"
          class="mb-2"
          label="Official Phone Number"
          placeholder="08012345678"
          variant="outlined"
          :error-messages="v$.form.contact_phone.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.contact_address"
          :readonly="loader"
          class="mb-2"
          label="Contact Address"
          placeholder="123 Tom Dick and Harry Close, Lagos, Nigeria"
          variant="outlined"
        />
      </el-col>
    </el-row>
    <div class="align-text-center">
      <h3>User Information</h3>
    </div>
    <el-row :gutter="10">
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.admin_first_name"
          :readonly="loader"
          class="mb-2"
          label="First Name"
          placeholder="John"
          variant="outlined"
          :error-messages="v$.form.admin_first_name.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.admin_last_name"
          :readonly="loader"
          class="mb-2"
          label="Last Name"
          placeholder="Doe"
          variant="outlined"
          :error-messages="v$.form.admin_last_name.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.admin_email"
          :readonly="loader"
          class="mb-2"
          label="Valid Email"
          placeholder="johndoe@example.com"
          variant="outlined"
          :error-messages="v$.form.admin_email.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
          v-model="form.admin_phone"
          :readonly="loader"
          class="mb-2"
          label="Enter Phone Number"
          placeholder="08012345678"
          variant="outlined"
          :error-messages="v$.form.admin_phone.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="12">
        <v-text-field
          density="compact"
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
          Submit
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
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      vendors: [],
      form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        role: 'vendor'
      },
      empty_form: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        admin_first_name: '',
        admin_last_name: '',
        admin_email: '',
        admin_phone: '',
        designation: '',
        role: 'vendor'
      },
      loader: false
    }
  },
  validations() {
    return {
      form: {
        organization_name: { required },
        contact_email: { required, email },
        contact_phone: { required },
        contact_address: '',
        admin_first_name: { required },
        admin_last_name: { required },
        admin_email: { required, email },
        admin_phone: { required },
        designation: { required }
      }
    }
  },
  // computed: {
  //   passwordToggleIcon() {
  //     return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
  //   },
  // },
  mounted() {},
  methods: {
    formSubmitted() {
      const registerResource = new Resource('vdd/register-vendor')
      const { form } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(form)
        .then((response) => {
          this.vendors.push(response.vendor)
          this.loader = false
          this.$emit('saved')
          this.$alert(`Vendor created successfully and notification is sent to ${form.admin_email}`)
          this.form = this.empty_form
          // this.$toast({
          //   component: ToastificationContent,
          //   props: {
          //     title: 'Vendor mounted Successfully',
          //     icon: 'CheckIcon',
          //     variant: 'success',
          //   },
          // })

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
