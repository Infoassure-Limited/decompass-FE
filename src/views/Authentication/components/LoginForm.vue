<template>
  <div>
    <div class="mt-100px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <div class="text-center mb-4">
        <img src="/images/logo/logo.png" width="300" alt="" />
      </div>
      <!-- form -->
      <div v-if="!reset_password">
        <div class="text-center mb-1">
          <h2 class="text-2xl">Sign In</h2>
        </div>
        <el-alert
          v-if="password_updated"
          title="Login with your updated password"
          type="success"
          :closable="false"
        />
        <br />
        <v-text-field
          v-model="userEmail"
          type="email"
          label="Email or Phone"
          variant="outlined"
          required
        />

        <v-text-field
          v-model="password"
          :type="show1 ? 'text' : 'password'"
          variant="outlined"
          label="Password"
        >
          <template v-slot:append-inner>
            <icon
              @click="show1 = !show1"
              :icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
              class="cursor-pointer"
            />
          </template>
        </v-text-field>
        <RouterLink class="el-link el-link--primary mb-15px" to="/forgot-password">
          Forgot Password?
        </RouterLink>

        <el-form-group>
          <Recaptcha ref="recaptcha" @verify="validate" />
        </el-form-group>

        <!-- <el-Button type="primary" class="w-[100%]" size="large" :loading="loading" @click="login">
          Log In
        </el-Button> -->
        <v-btn
          :disabled="loading"
          color="black"
          text="Login"
          block
          :loading="loading"
          @click="executeRecaptcha"
        />
        <br />

        <p class="text-center mt-5">
          Don't have an account?
          <RouterLink class="el-link el-link--primary" to="/register">Sign Up</RouterLink>
        </p>
      </div>
      <div v-if="reset_password">
        <h2 class="text-2xl font-bold text-left w-[100%] mb-15px">Password Change Required</h2>
        <el-alert :title="title" type="error" :closable="false" />
        <br />
        <!-- <v-text-field v-model="userEmail" label="Email" variant="outlined" disabled /> -->

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
          <Recaptcha ref="recaptcha" @verify="validate2" />
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
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, password } from '@validations'
import Recaptcha from '@/views/Components/Recaptcha.vue'
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
      reset_password: false,
      form: {
        email: '',
        new_password: '',
        confirm_password: '',
        message: ''
      },
      password_updated: false,
      g_recaptcha_response: '',
      confirm_otp: false,
      userId: null,
      show1: false
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
  methods: {
    validate(response) {
      this.g_recaptcha_response = response
      // console.log(response)
      this.login()
    },
    validate2(response) {
      this.g_recaptcha_response = response
      // console.log(response)
      this.updatePassword()
    },
    // execute the recaptcha widget
    executeRecaptcha() {
      this.$refs.recaptcha.execute()
    },
    isLoggedIn() {
      // If user is already logged in notify
      if (isUserLoggedIn) {
        return true
      }
      return false
    },
    login() {
      // Loading
      this.loading = true

      const userDetails = {
        username: this.userEmail,
        password: this.password,
        recaptcha: this.g_recaptcha_response
        // remember_me: this.checkbox_remember_me,
      }
      this.$store
        .dispatch('user/login', userDetails)
        .then((response) => {
          this.loading = false
          if (response.message === 'OTP') {
            this.userId = response.user.id
            this.$emit('to-otp')
            this.$emit('loggedInUserId', response.user.id)
          } else if (response.message === 'change_password') {
            this.reset_password = true
            this.form.email = response.user.email
            this.form.id = response.user.id
            this.title = 'Change your password from the default one'
          } else if (response.message === 'password_due_for_change') {
            this.reset_password = true
            this.form.email = response.user.email
            this.form.id = response.user.id
            this.title = 'Your password is due for a change'
            this.form.message = 'password_due_for_change'
          } else {
            // if (appStore.getDynamicRouter) {
            //   getRole()
            // } else {
            //   permissionStore.generateRoutes('static').catch(() => {})
            //   permissionStore.getAddRouters.forEach((route) => {
            //     addRoute(route)
            //   })
            //   permissionStore.setIsAddRouters(true)
            //   push({ path: redirect.value || permissionStore.addRouters[0].path })
            // }
            this.$message({
              title: 'Login Success',
              icon: 'BellIcon',
              type: 'success',
              message: 'Welcome'
            })
            // we load the browser this once
            window.location = '/'
            // this.$router.push({ path: '/dashboard/analysis' }).catch(() => {}) // window.location = '/dashboard/ecommerce'
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message({
            title: 'Error', // .response.statusText,
            icon: 'AlertTriangleIcon',
            type: 'error',
            message: error.response.data.message
          })
          // console.log(error)
        })
    },
    updatePassword() {
      if (this.form.new_password === this.password) {
        this.$alert('New password MUST be different from the old one')
        return false
      }

      if (this.form.confirm_password !== this.form.new_password && this.form.new_password !== '') {
        this.$alert('New Password does not match')
        return false
      }
      this.loading = true
      const form = {
        email: this.userEmail,
        password: this.form.new_password,
        recaptcha: this.g_recaptcha_response
      }
      this.$store
        .dispatch('user/updatePassword', form)
        .then(() => {
          this.loading = false
          this.$message('Password Reset Successful')
          this.password_updated = true
          this.reset_password = false
          this.password = ''
        })
        .catch((error) => {
          this.$message(error.response.data.message)
          this.loading = false
        })
    }
  }
}
</script>
