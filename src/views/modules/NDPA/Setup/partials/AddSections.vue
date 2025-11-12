<template>
  <div v-loading="load">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Action</th>
          <th>Section</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(detail, index) in details" :key="index">
          <td>
            <span>
              <el-button
                v-if="details.length > 1"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="removeDetail(index)"
              />
              <el-button
                v-if="index + 1 === details.length"
                type="primary"
                icon="el-icon-plus"
                circle
                @click="addDetail(index)"
              />
            </span>
          </td>
          <td>
            <el-input v-model="detail.name" placeholder="Example: Section 24" type="text" />
          </td>
          <td>
            <el-input
              v-model="detail.description"
              placeholder="Principles of Personal Data Processing"
              type="text"
            />
          </td>
        </tr>
        <tr v-if="fill_fields_error">
          <td colspan="4">
            <label class="label label-danger"
              >Please fill all empty fields before adding another row</label
            >
          </td>
        </tr>
        <tr v-if="!isRowEmpty()">
          <td colspan="3">
            <el-button variant="success" @click="submit()"> Submit </el-button>
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
    clause: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      details: [],
      dialogVisible: false,
      fill_fields_error: false,
      load: false,
      rowIndex: '',
      form: {
        clause_id: '',
        section_details: []
      },
      showTable: false
    }
  },
  created() {
    this.form.clause_id = this.clause.id
    this.addDetail()
  },
  methods: {
    isRowEmpty() {
      const checkEmptyLines = this.details.filter(
        (detail) => detail.name === '' || detail.description === ''
      )
      if (checkEmptyLines.length > 0) {
        return true
      }
      return false
    },
    addDetail() {
      this.fill_fields_error = false

      if (this.isRowEmpty()) {
        this.fill_fields_error = true
      } else {
        this.details.push({
          name: '',
          description: ''
        })
      }
    },
    removeDetail(detailId) {
      this.fill_fields_error = false
      if (!this.repBlockRemoval) {
        this.details.splice(detailId, 1)
      }
    },
    submit() {
      this.load = true
      const formData = this.form
      formData.section_details = this.details
      const updatePhotoResource = new Resource('ndpa/clauses/save-section')
      updatePhotoResource
        .store(formData)
        .then(() => {
          this.load = false
          this.uploadableFile = null
          this.details = [
            {
              name: '',
              description: ''
            }
          ]
          this.$emit('reload')
          this.$message('Action successful')
        })
        .catch((e) => {
          this.load = false
          this.$message(e.response.message)
        })
    }
  }
}
</script>
