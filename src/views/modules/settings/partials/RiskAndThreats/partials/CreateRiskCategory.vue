<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <h3 v-if="isEdit"> Edit </h3>
    <h3 v-else> Create New </h3>
    <table class="table table-bordered">
      <tbody>
        <tr>
          <td>Title</td>
          <td>
            <el-input v-model="form.name" placeholder="Enter Category Title" />
          </td>
        </tr>
        <tr>
          <td>Sub-Categories</td>
          <td>
            <div v-for="sub_category in sub_categories" :key="sub_category">
              <el-tag
                closable
                type="danger"
                :disable-transitions="false"
                @close="handleClose(sub_category)"
              >
                {{ sub_category }}
              </el-tag>
              <br />
            </div>
            <el-input
              v-if="inputVisible"
              ref="saveTagInput"
              v-model="inputValue"
              class="input-new-tag"
              placeholder="Type sub category"
              size="mini"
              style="width: 70%"
              @keyup="handleInputConfirm"
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
              type="success"
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
      </tbody>
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
    selectedData() {
      this.form = this.selectedData
      this.setSubCategories()
    },
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
          subCategories.push(subCat)
        })
      }
      this.sub_categories = subCategories
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
      this.loading = true
      const { form } = this
      form.client_id = this.clientId
      form.sub_categories = this.sub_categories
      saveEntryResource
        .store(form)
        .then(() => {
          this.$emit('saved')
          this.loading = false
          this.$message({
            message: 'Saved',
            type: 'success'
          })
          this.form = { name: '', sub_categories: [] }
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    updateEntry(id) {
      const saveEntryResource = new Resource('risk-assessment/update-category')
      this.loading = true
      const { form } = this
      form.client_id = this.clientId
      form.sub_categories = this.sub_categories
      saveEntryResource
        .update(id, form)
        .then(() => {
          this.$message({
            message: 'Updated',
            type: 'success'
          })
          this.$emit('saved')
          this.loading = false
        })
        .catch((error) => {
          // console.log(error.response)
          this.$message.error(error.response.data.error)
          this.loading = false
        })
    },
    deleteEntry(row) {
      if (window.confirm('Click OK to confirm delete action')) {
        const saveEntryResource = new Resource('risk-assessment/delete-category')
        this.loading = true
        saveEntryResource
          .destroy(row.id)
          .then(() => {
            this.loading = false
          })
          .catch((error) => {
            // console.log(error.response)
            this.$message.error(error.response.data.error)
            this.loading = false
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
