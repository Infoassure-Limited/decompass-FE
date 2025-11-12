<template>
  <v-sheet class="mx-auto" width="400">
    <el-card v-loading="load" class="mt-30">
      <div align="center">
        <img src="/images/logo/logo.png" alt="logo" width="250" class="mx-auto" />
      </div>
      <!-- form -->
      <h3 class="mb-5" align="center"> Check In </h3>

      <el-form-group label="Email" label-for="email">
        <v-text-field
          id="email"
          v-model="form.email"
          name="email"
          placeholder="john@example.com"
          label="Email"
          variant="outlined"
        />
      </el-form-group>
      <el-form-group label="Password" label-for="password">
        <v-text-field
          id="email"
          v-model="form.password"
          type="password"
          name="password"
          placeholder="Password"
          label="Password"
          variant="outlined"
        />
      </el-form-group>

      <el-button
        :disabled="form.email === '' || form.password === ''"
        type="primary"
        @click="submitForm()"
      >
        Submit
      </el-button>
    </el-card>
  </v-sheet>
</template>

<script>
export default {
  props: {
    productModule: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        product_module: 'vdd'
      },
      load: false
    }
  },
  created() {
    this.form.product_module = this.productModule
  },
  methods: {
    submitForm() {
      this.load = true
      const { form } = this
      console.log(form)
      this.$store
        .dispatch('user/otherUserLogin', form)
        .then((response) => {
          this.$message({
            message: response.message,
            type: 'success'
          })
          this.form = {
            email: '',
            password: ''
          }
          this.load = false
          window.location = this.$route.path
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
