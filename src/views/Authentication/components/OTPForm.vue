<template>
  <div>
    <div class="mt-150px dark:(border-1 border-[var(--el-border-color)] border-solid)">
      <!-- form -->
      <h2 class="text-2xl font-bold text-center w-[100%] mb-15px">🔒 One Time Passkey </h2>
      <div class="mb-2 text-center"> Kindly enter the OTP sent to your email below </div>
      <form @submit.prevent="login">
        <v-otp-input v-model="token" placeholder="*" />
        <el-form-group>
          <Recaptcha ref="recaptcha" @verify="validate" />
        </el-form-group>
        <v-btn
          :disabled="token.length < 6 || loading"
          color="black"
          text="Submit"
          variant="outlined"
          block
          :loading="load"
          @click="executeRecaptcha"
        />
      </form>
      <br />

      <div
        v-if="showResend"
        style="cursor: pointer; margin-top: 20px; text-align: center"
        @click="resendToken()"
      >
        <strong>Didn't get the token? Resend</strong>
      </div>
      <div v-else>
        Your token has been sent to your email, kindly check your email. <br />
        Didn't get the token? please wait for
        {{ count }} seconds...
      </div>
      <!-- /Reset Password v1 -->
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import Recaptcha from '@/views/Components/Recaptcha.vue'

export default {
  components: {
    Recaptcha
  },
  props: {
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      token: '',
      load: false,
      showResend: false,
      count: 90,
      g_recaptcha_response: '',
      countDecrement: null
    }
  },
  beforeUnmount() {
    clearInterval(this.countDecrement)
    this.countDecrement = null
  },
  mounted() {
    this.delayResend()
  },
  methods: {
    validate(response) {
      this.g_recaptcha_response = response
      // console.log(response)
      this.validationForm()
    },
    // execute the recaptcha widget
    executeRecaptcha() {
      this.$refs.recaptcha.execute()
    },
    checkLength() {
      if (this.token.length === 6) {
        // console.log(this.token.length)
        this.validationForm()
      }
    },
    delayResend() {
      this.showResend = false
      this.countDecrement = setInterval(() => {
        this.count -= 1
      }, 1000)
      setTimeout(() => {
        this.showResend = true
      }, 90000)
    },
    resendToken() {
      this.token = ''
      this.count = 90
      const confirmTokenResource = new Resource('auth/sent-2fa-code')
      this.load = true
      confirmTokenResource
        .update(this.userId)
        .then(() => {
          this.countDecrement = null
          this.delayResend()
          this.$message('Token sent to your email')
          this.load = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.message)
          this.load = false
        })
    },
    validationForm() {
      this.load = true
      this.$store
        .dispatch('user/confirmOTP', {
          id: this.userId,
          token: this.token,
          recaptcha: this.g_recaptcha_response
        })
        .then(() => {
          this.$message({
            title: 'Login Success',
            type: 'success',
            message: 'Welcome'
          })

          // we load the browser this once
          window.location = '/' // this.$router.push({ path: '/' }).catch(() => {}) // window.location = '/dashboard/ecommerce'

          this.load = false
        })
        .catch((error) => {
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
