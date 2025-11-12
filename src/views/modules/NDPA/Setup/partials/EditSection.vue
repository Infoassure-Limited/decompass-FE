<template>
  <div v-loading="load">
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Section</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <el-input v-model="form.name" placeholder="Example: Section 24" type="text" />
          </td>
          <td>
            <el-input
              v-model="form.description"
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
            <b-button variant="success" @click="submit()"> Submit </b-button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import Resource from '@/api/resource'

export default {
  components: {},
  props: {
    section: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fill_fields_error: false,
      load: false,
      form: {
        clause_id: '',
        name: '',
        description: ''
      },
      showTable: false
    }
  },
  created() {
    this.form = this.section
  },
  methods: {
    isRowEmpty() {
      if (this.form.name === '' || this.form.description === '') {
        return true
      }
      return false
    },
    submit() {
      this.load = true
      const formData = this.form
      const updateSectionResource = new Resource('ndpa/clauses/update-section')
      updateSectionResource
        .update(formData.id, formData)
        .then(() => {
          this.load = false
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
