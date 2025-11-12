<template>
  <div v-loading="load">
    <div class="mt-100px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <div class="text-center mb-4">
        <img src="/images/logo/logo.png" width="300" alt="" />
      </div>
      <div v-if="userEmail !== ''">
        <h2 class="text-2xl font-bold text-left w-[100%] mb-15px">Reset Password 🔒</h2>
        <v-text-field v-model="userEmail" label="Email" variant="outlined" disabled />

        <v-text-field
          v-model="form.new_password"
          :type="show1 ? 'text' : 'password'"
          variant="outlined"
          label="New Password"
          :error-messages="v$.form.new_password.$errors.map((e) => e.$message)"
          @blur="v$.form.new_password.$touch"
        >
          <template v-slot:append-inner>
            <icon
              @click="show1 = !show1"
              :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              class="cursor-pointer"
            />
          </template>
        </v-text-field>
        <br />
        <v-text-field
          v-model="form.confirm_password"
          :type="show1 ? 'text' : 'password'"
          variant="outlined"
          label="Confirm Password"
          :error-messages="v$.form.confirm_password.$errors.map((e) => e.$message)"
          @blur="v$.form.confirm_password.$touch"
        >
          <template v-slot:append-inner>
            <icon
              @click="show1 = !show1"
              :icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              class="cursor-pointer"
            />
          </template>
        </v-text-field>
        <br />
        <el-form-group>
          <Recaptcha ref="recaptcha" @verify="validate" />
        </el-form-group>
        <el-Button
          :disabled="v$.form.$invalid"
          type="success"
          class="w-[100%]"
          size="large"
          :loading="loading"
          @click="executeRecaptcha"
        >
          Update Password
        </el-Button>
      </div>
      <div>
        <div v-if="showInvalid" align="center">
          <icon icon="tabler:lock-open-off" size="150" />
          <h2 class="text-2xl font-bold w-[100%] mb-15px">Invalid Token</h2>
          <el-Button
            type="primary"
            class="w-[100%]"
            size="large"
            @click="$router.push('/forgot-password')"
          >
            Go to Forgot Password
          </el-Button>
        </div>
      </div>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, password } from '@validations'
import Recaptcha from '@/views/Components/Recaptcha.vue'
import Resource from '@/api/resource'
// import { usePermissionStore } from '@/store/modules/permission'
// import { RouterLink, useRouter } from 'vue-router'
// const permissionStore = usePermissionStore()
// const { currentRoute, addRoute, push } = useRouter()
export default {
  setup() {
    return { v$: useVuelidate() }
  },
  components: {
    Recaptcha
  },
  data() {
    return {
      title: '',
      status: '',
      password: '',
      userEmail: '',
      loading: false,
      load: false,
      reset_password: false,
      form: {
        email: '',
        new_password: '',
        confirm_password: '',
        message: ''
      },
      g_recaptcha_response: '',
      password_updated: false,
      confirm_otp: false,
      userId: null,
      show1: false,
      showInvalid: false
    }
  },
  validations() {
    return {
      form: {
        new_password: password(this.form.new_password),
        confirm_password: { required, sameAsPassword: sameAs(this.form.new_password) }
      }
    }
  },
  mounted() {
    this.confirmToken()
  },
  methods: {
    validate(response) {
      this.g_recaptcha_response = response
      // console.log(response)
      this.submit()
    },
    // execute the recaptcha widget
    executeRecaptcha() {
      this.$refs.recaptcha.execute()
    },
    confirmToken() {
      const { token } = this.$route.params
      const confirmTokenResource = new Resource('auth/confirm-password-reset-token')
      this.load = true
      this.showInvalid = false
      confirmTokenResource
        .get(token)
        .then((response) => {
          this.userEmail = response.email
          this.load = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.message)
          this.showInvalid = true
          this.load = false
        })
    },
    submit() {
      this.loading = true
      this.$store
        .dispatch('user/updatePassword', {
          email: this.userEmail,
          password: this.form.new_password,
          recaptcha: this.g_recaptcha_response
        })
        .then(() => {
          this.$message({
            message: 'Password Reset Successfull',
            type: 'success'
          })
          this.loading = false
          this.$router.push({ path: '/login' })
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message({
            message: error.response.data.message,
            type: 'error'
          })
          this.loading = false
        })
    }
  }
}
</script>
