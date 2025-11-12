<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <h3 v-if="isEdit"> Edit </h3>
    <h3 v-else> Create New </h3>
    <table class="table table-bordered">
      <tr>
        <td>Title</td>
        <td>
          <el-input v-model="form.name" placeholder="Enter Category Title" />
        </td>
      </tr>
      <tr>
        <td>Sub-Categories</td>
        <td>
          <el-tag
            v-for="sub_category in sub_categories"
            :key="sub_category"
            closable
            type="success"
            :disable-transitions="false"
            @close="handleClose(sub_category)"
          >
            {{ sub_category }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            placeholder="Type sub category"
            size="mini"
            style="width: 70%"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <a v-else style="color: #409eff" @click="showInput"> + Add New </a>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <el-button
            v-if="isEdit"
            :disabled="form.name === ''"
            type="primary"
            style="width: 30%"
            @click="updateEntry(form.id)"
          >
            Update
          </el-button>
          <el-button
            v-else
            type="success"
            :disabled="form.name === ''"
            style="width: 30%"
            @click="submitEntry()"
          >
            Save
          </el-button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  props: {
    clientId: {
      type: Number,
      default: () => null
    },
    selectedData: {
      type: Object,
      default: () => null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: { name: '', sub_categories: [] },
      categories: [],
      sub_categories: [],
      loading: false,
      inputVisible: false,
      inputValue: ''
    }
  },
  watch: {
    isEdit() {
      this.form = this.selectedData
      this.setSubCategories()
    }
  },
  created() {
    this.form = this.selectedData
    this.setSubCategories()
  },
  methods: {
    setSubCategories() {
      const category = this.selectedData
      const subCategories = []
      if (category.sub_categories !== null) {
        category.sub_categories.forEach((subCat) => {
          subCategories.push(subCat.name)
        })
      }
      app.sub_categories = subCategories
    },
    handleClose(tag) {
      this.sub_categories.splice(this.sub_categories.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const { inputValue } = this
      if (inputValue) {
        this.sub_categories.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    submitEntry() {
      const saveEntryResource = new Resource('risk-assessment/save-categories')
      app.loading = true
      const { form } = app
      form.client_id = app.clientId
      form.sub_categories = app.sub_categories
      saveEntryResource
        .store(form)
        .then(() => {
          app.$emit('saved')
          app.loading = false
          app.$notify({
            title: 'Saved',
            type: 'success'
          })
          app.form = { name: '', sub_categories: [] }
        })
        .catch((error) => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    updateEntry(id) {
      const saveEntryResource = new Resource('risk-assessment/update-category')
      app.loading = true
      const { form } = app
      form.client_id = app.clientId
      form.sub_categories = app.sub_categories
      saveEntryResource
        .update(id, form)
        .then(() => {
          app.$notify({
            title: 'Updated',
            type: 'success'
          })
          app.$emit('saved')
          app.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          app.$message.error(error.response.data.error)
          app.loading = false
        })
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-category')
        app.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            app.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            app.$message.error(error.response.data.error)
            app.loading = false
          })
      }
    }
  }
}
</script>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
