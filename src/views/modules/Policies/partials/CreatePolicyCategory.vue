<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="24">
        <v-text-field
          v-model="form.name"
          :readonly="loader"
          class="mb-2"
          label="Category Name"
          placeholder="Information Security Policy"
          variant="outlined"
          :error-messages="v$.form.name.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="24">
        <v-textarea
          v-model="form.description"
          :readonly="loader"
          class="mb-2"
          label="Category Description"
          placeholder="Describe category here..."
          variant="outlined"
        />
        <!-- <label for="">Give Description</label>
        <Editor v-model="form.description" label="Describe category..." /> -->
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
// import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'

export default {
  components: {
    // Editor
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        name: '',
        description: ''
      },
      empty_form: {
        name: '',
        description: ''
      },
      loader: false
    }
  },
  validations() {
    return {
      form: {
        name: { required },
        description: ''
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
      const registerResource = new Resource('policy/policy-categories/store')
      const { form } = this
      this.loader = true
      // const email = form.admin_email
      registerResource
        .store(form)
        .then((response) => {
          this.loader = false
          this.$emit('saved')
          this.$message(`Action Successful`)
          this.form = this.empty_form
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
