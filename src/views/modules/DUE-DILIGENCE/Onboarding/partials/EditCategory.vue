<template>
  <div class="justify-content-between align-items-center px-2 py-1">
    <el-row v-loading="loading">
      <!-- Category Name -->
      <el-col cols="12">
        <v-text-field
          v-model="form.name"
          variant="outlined"
          label="Category Name"
          placeholder="ISMS Manager"
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
        <el-button type="primary" class="mr-1" @click="update()"> Update </el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    isEditCategorySidebarActive: {
      type: Boolean,
      required: true
    },
    selectedCategory: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        description: ''
      },
      loading: false
    }
  },
  created() {
    this.form.id = this.selectedCategory.id
    this.form.name = this.selectedCategory.name
    this.form.description = this.selectedCategory.description
  },
  methods: {
    update() {
      this.loading = true
      const updateCurriculumSetupResource = new Resource('vdd/update-vendor-category')
      const param = this.form
      updateCurriculumSetupResource.update(param.id, param).then((response) => {
        this.loading = false
        this.$emit('update', response.categorys)
        this.$emit('update:is-edit-level-sidebar-active', false)
      })
    }
  }
}
</script>
