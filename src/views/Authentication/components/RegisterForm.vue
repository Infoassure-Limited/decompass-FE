<template>
  <div class="mt-150px dark:(border-1 border-[var(--el-border-color)] border-solid)">
    <div class="text-center mb-4">
      <img src="/images/logo/logo.png" width="300" alt="" />
    </div>
    <div class="text-center mb-4">
      <h2 class="text-2xl font-bold">Sign Up</h2>
      <p class="text-gray-600">Create a new account to get started</p>
    </div>
    <form-wizard
      @on-complete="validationFormInfo"
      @on-loading="loader"
      shape="circle"
      color="black"
      step-size="xs"
      error-color="#e74c3c"
      back-button-text="Back"
      next-button-text="Next"
      finish-button-text="Submit"
    >
      <tab-content title="Organization Information" :before-change="validateOrganization">
        <el-row>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Name of Comapny/Organization"
              v-model="company.organization_name"
              placeholder="ABC Company Ltd."
              :error-messages="v$.company.organization_name.$errors.map((e) => e.$message)"
              @blur="v$.company.organization_name.$touch"
            />
          </el-col>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Company Email"
              v-model="company.contact_email"
              placeholder="example@companydomain.com"
              :error-messages="v$.company.contact_email.$errors.map((e) => e.$message)"
              @blur="v$.company.contact_email.$touch"
            />
          </el-col>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Official Phone Number"
              v-model="company.contact_phone"
              placeholder="08012345678"
              :error-messages="v$.company.contact_phone.$errors.map((e) => e.$message)"
              @blur="v$.company.contact_phone.$touch"
            />
          </el-col>
          <el-col :md="24">
            <v-textarea
              variant="outlined"
              density="compact"
              label="Company Address"
              rows="2"
              v-model="company.contact_address"
              placeholder="123 Tom Dick and Harry Close, Lagos, Nigeria"
            />
          </el-col>
        </el-row>
      </tab-content>
      <tab-content title="User Information">
        <el-row>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              label="First Name"
              v-model="user.admin_first_name"
              placeholder="Enter First Name"
              :error-messages="v$.user.admin_first_name.$errors.map((e) => e.$message)"
              @blur="v$.user.admin_first_name.$touch"
            />
          </el-col>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Last Name"
              v-model="user.admin_last_name"
              placeholder="Enter Last Name"
              :error-messages="v$.user.admin_last_name.$errors.map((e) => e.$message)"
              @blur="v$.user.admin_last_name.$touch"
            />
          </el-col>
          <el-col :md="24">
            <small class="text-primary">
              <strong>A notification will be sent to this e-mail</strong>
            </small>
            <v-text-field
              variant="outlined"
              density="compact"
              id="email"
              v-model="user.email"
              placeholder="Enter Email Address"
              label="Official Email"
              :error-messages="v$.user.email.$errors.map((e) => e.$message)"
              @blur="v$.user.email.$touch"
            />
          </el-col>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              id="phone"
              v-model="user.phone"
              label="Mobile Number"
              placeholder="Enter Phone Number"
              :error-messages="v$.user.phone.$errors.map((e) => e.$message)"
              @blur="v$.user.phone.$touch"
            />
          </el-col>
          <el-col :md="24">
            <v-text-field
              variant="outlined"
              density="compact"
              label="Designation"
              v-model="user.designation"
              placeholder="Your designation at work"
              :error-messages="v$.user.designation.$errors.map((e) => e.$message)"
              @blur="v$.user.designation.$touch"
            />
          </el-col>
        </el-row>
      </tab-content>

      <div class="loader" v-if="loadingWizard"></div>
      <div v-if="errorMsg">
        <span class="error">{{ errorMsg }}</span>
      </div>
    </form-wizard>
    <el-row>
      <el-form-group>
        <Recaptcha ref="recaptcha" @verify="validate" />
      </el-form-group>
      <!-- <el-col :md="24">
        <hr />
        <v-btn
          :disabled="loader"
          :loading="loader"
          color="green"
          size="large"
          variant="flat"
          block
          @click="validationFormInfo"
        >
          Submit
        </v-btn>
      </el-col> -->
    </el-row>
    <el-card-text class="text-center mt-2">
      <hr />
      <span>Already with us? </span>
      <RouterLink class="el-link el-link--primary" to="/login">Sign In</RouterLink>
    </el-card-text>
  </div>
</template>

<script>
import { FormWizard, TabContent } from 'vue3-form-wizard'
import 'vue3-form-wizard/dist/style.css'
import { useVuelidate } from '@vuelidate/core'
import { required, email, minLength } from '@validations'
import Recaptcha from '@/views/Components/Recaptcha.vue'
// import { codeIcon } from './code'
import Resource from '@/api/resource'

export default {
  components: {
    Recaptcha,
    FormWizard,
    TabContent
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    const maxDate = new Date()
    return {
      max: maxDate,
      selectedContry: '',
      selectedLanguage: '',
      company: {
        organization_name: '',
        contact_email: '',
        contact_phone: '',
        contact_address: ''
      },
      user: {
        admin_first_name: '',
        admin_last_name: '',
        email: '',
        // password: '',
        // cpassword: '',
        phone: '',
        designation: '',
        role: 'admin',
        recaptcha: ''
      },
      genders: ['Male', 'Female'],
      loader: false,
      passwordFieldType: 'password'
    }
  },
  validations() {
    return {
      company: {
        organization_name: { required },
        contact_email: { required, email },
        contact_phone: { required, minLength: minLength(11) }
      },
      user: {
        admin_first_name: { required },
        admin_last_name: { required },
        email: { required, email },
        // password: { required, password },
        // cpassword: { required },
        phone: { required, minLength: minLength(8) },
        designation: { required }
      }
    }
  },
  computed: {
    passwordToggleIcon() {
      return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
    }
  },
  created() {},
  methods: {
    // execute the recaptcha widget
    executeRecaptcha() {
      this.$refs.recaptcha.execute()
    },
    validate(response) {
      this.user.recaptcha = response
      // console.log(response)
      this.formSubmitted()
    },
    async validateOrganization() {
      const success = await this.v$.company.$validate()
      if (success) {
        return true
      } else {
        this.$alert('Please fill all required fields correctly.')
        return false
      }
    },
    async validationFormInfo() {
      const success = await this.v$.user.$validate()
      if (success) {
        this.executeRecaptcha()
      } else {
        this.$alert('Please fill all required fields correctly.')
        return false
      }
    },
    resetForm() {
      this.company = {
        organization_name: { required },
        contact_email: { required, email },
        contact_phone: { required, minLength: minLength(11) }
      }
      this.user = {
        admin_first_name: { required },
        admin_last_name: { required },
        email: { required, email },
        // password: { required, password },
        // cpassword: { required },
        phone: { required, minLength: minLength(8) },
        designation: { required }
      }
    },
    formSubmitted() {
      const registerResource = new Resource('auth/register-client')
      const form = { ...this.company, ...this.user }
      this.loader = true
      const email = form.email
      registerResource
        .store(form)
        .then(() => {
          this.resetForm()
          this.loader = false
          this.$message({
            type: 'success',
            message: 'Registration Successful'
          })

          // this.$alert(`A confirmation link has been sent to ${email}. Kindly check your mail and click on the link to complete your registration.`)
          this.$alert(
            `<strong>A confirmation link has been sent to ${email}.</strong><br>Kindly check your mail and click on the link to complete your registration.`,
            'Registration Successful & Confirmation Link Sent',
            {
              dangerouslyUseHTMLString: true
            }
          )
          this.$router.push({ path: '/login' })
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
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
.card {
  border-top-left-radius: 30px;
  border-bottom-right-radius: 30px;
}
</style>
