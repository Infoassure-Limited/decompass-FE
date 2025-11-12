<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="24">
        <v-text-field
          v-model="form.title"
          :readonly="loader"
          class="mb-2"
          label="Title"
          placeholder="Information Security Policy"
          variant="outlined"
          :error-messages="v$.form.title.$errors.map((e) => e.$message)"
        />
      </el-col>
      <el-col :md="24">
        <label for="">Policy Content</label>
        <Editor v-model="form.content" label="Content of the policy..." />
        <span v-if="v$.form.content.$errors.length > 0">{{
          v$.form.content.$errors.map((e) => e.$message)
        }}</span>
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
import { Editor } from '@/components/Editor'
import Resource from '@/api/resource'

export default {
  components: {
    Editor
  },
  props: {
    categoryId: {
      type: Number,
      required: true
    }
  },
  setup() {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      form: {
        title: '',
        content: ''
      },
      empty_form: {
        title: '',
        content: ''
      },
      loader: false
    }
  },
  validations() {
    return {
      form: {
        title: { required },
        content: { required }
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
      const createResource = new Resource('policy/policies/store')
      const { form } = this
      this.loader = true
      form.category_id = this.categoryId
      createResource
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
