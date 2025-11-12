<template>
  <div>
    <div class="mt-50px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <div class="text-center mb-4">
        <img src="/images/logo/logo.png" width="300" alt="" />
      </div>
      <!-- form -->
      <h2 class="text-2xl font-bold text-left w-[100%] mb-15px"> 🔒 Forgot Password? </h2>
      <div class="font-normal text-14px italic mb-15px">
        Don't worry! We all do sometimes. Enter your email and we'll guide you on how to reset your
        password
      </div>
      <v-text-field
        v-model="userEmail"
        type="email"
        label="Enter Email"
        variant="outlined"
        placeholder="john@example.com"
        required
      />
      <Recaptcha ref="recaptcha" @verify="validate" />
      <br />
      <v-btn
        :disabled="userEmail === ''"
        color="black"
        text="Send reset link"
        block
        :loading="loading"
        @click="executeRecaptcha"
      />

      <p class="text-center mt-5">
        <RouterLink class="el-link el-link--primary" to="/login">Back to login</RouterLink>
      </p>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import Recaptcha from '@/views/Components/Recaptcha.vue'
import Resource from '@/api/resource'

export default {
  components: {
    Recaptcha
  },
  data() {
    return {
      userEmail: '',
      g_recaptcha_response: '',
      load: false
    }
  },
  mounted() {
    // console.log(this.$router)
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
    submit() {
      const confirmEmailResource = new Resource('auth/recover-password')
      this.load = true
      confirmEmailResource
        .store({ email: this.userEmail, recaptcha: this.g_recaptcha_response })
        .then((response) => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.userEmail = ''
          this.$refs.recaptcha.reset()
          this.load = false
          this.$emit('to-login')
        })
        .catch((error) => {
          this.$refs.recaptcha.reset()
          this.$message({
            message: error.response.data.message,
            type: 'error'
          })
          this.load = false
        })
    }
  }
}
</script>
