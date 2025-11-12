<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <!-- Category Name -->
      <el-col cols="12">
        <v-text-field
          v-model="form.name"
          variant="outlined"
          label="Category Name"
          placeholder="Strategic Partner"
        />
      </el-col>
      <!-- Abbrev -->
      <el-col cols="12">
        <v-textarea
          v-model="form.description"
          variant="outlined"
          label="Category Description"
          placeholder="Briefly describe category..."
        />
      </el-col>
      <!-- submit and reset -->
      <el-col cols="12">
        <el-button type="primary" class="mr-1" @click="submit()"> Submit </el-button>
      </el-col>
      <el-col v-if="error" cols="12">
        <el-alert variant="danger" show>
          <div class="alert-body">
            <span
              ><strong>{{ error_message }}</strong></span
            >
          </div>
        </el-alert>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    isCreateCategorySidebarActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      form: {
        name: '',
        description: ''
      },
      loading: false,
      error: false
    }
  },
  methods: {
    submit() {
      this.loading = true
      const saveCategoryResource = new Resource('vdd/save-vendor-category')
      const param = this.form
      saveCategoryResource
        .store(param)
        .then((response) => {
          this.loading = false
          this.$emit('save', response.categorys)
        })
        .catch((error) => {
          this.error = true
          this.$message(error.response.data.message)
          this.loading = false
        })
    }
  }
}
</script>
