<template>
  <div style="width: 700px; margin: auto; text-align: center">
    <div style="background: #000000; padding: 20px; border-radius: 10px" class="mt-70">
      <!-- Login v1 -->
      <el-card v-loading="load">
        <el-card-title class="mb-1 font-weight-bold" title-tag="h2" align="center">
          <h1>{{ message }}</h1>
        </el-card-title>
        <el-card-text v-if="message !== ''" class="text-center mt-2">
          <RouterLink class="el-link el-link--primary" to="/login">
            Redirecting to the login page in {{ counter }} seconds...
          </RouterLink>
        </el-card-text>
      </el-card>
      <!-- /Login v1 -->
    </div>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  data() {
    return {
      message: '',
      load: false,
      counter: 5,
      counterDecrement: null
    }
  },
  created() {
    this.confirmRegistration()
  },
  beforeUnmount() {
    clearInterval(this.counterDecrement)
  },
  methods: {
    confirmRegistration() {
      const { code } = this.$route.params
      const confirmCodeResource = new Resource('auth/confirm-registration')
      this.load = true
      confirmCodeResource
        .list({ code })
        .then((response) => {
          this.message = response
          this.redirectToLogin()
          this.load = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.load = false
        })
    },
    redirectToLogin() {
      this.counterDecrement = setInterval(() => {
        this.counter -= 1
      }, 1000)
      setTimeout(() => {
        this.$router.push('/login')
      }, 5000)
    }
  }
}
</script>
<style scoped>
.no-padding {
  padding: 0 !important;
}
</style>
